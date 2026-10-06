import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Provider from '@/models/Provider';
import { comparePassword, signToken, setAuthCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const parseResult = loginSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: { message: parseResult.error.errors[0].message } },
        { status: 400 }
      );
    }

    const { email, password, role: requestedRole } = parseResult.data;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid email or password' } },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid email or password' } },
        { status: 401 }
      );
    }

    if (requestedRole && user.role !== requestedRole) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Account found, but role is '${user.role}' instead of '${requestedRole}'. Please select '${user.role}' role.`,
          },
        },
        { status: 400 }
      );
    }

    // Provider approval checks
    if (user.role === 'provider') {
      const provider = await Provider.findOne({ user: user._id });
      if (!provider) {
        return NextResponse.json(
          { success: false, error: { message: 'Provider profile not found.' } },
          { status: 404 }
        );
      }

      if (provider.approvalStatus === 'pending' || !provider.isApproved) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: 'Your provider account is waiting for admin approval.',
              approvalStatus: 'pending',
            },
          },
          { status: 403 }
        );
      }

      if (provider.approvalStatus === 'rejected') {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: 'Your provider application was rejected by admin. Please contact support.',
              approvalStatus: 'rejected',
            },
          },
          { status: 403 }
        );
      }

      if (provider.approvalStatus === 'blocked' || !provider.isActive || !user.isActive) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: 'Your account has been suspended or blocked by admin.',
              approvalStatus: 'blocked',
            },
          },
          { status: 403 }
        );
      }
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: { message: 'Account is deactivated' } },
        { status: 403 }
      );
    }

    const token = signToken({ userId: user._id.toString(), role: user.role });

    let redirectPath = '/customer';
    if (user.role === 'provider') redirectPath = '/provider';
    if (user.role === 'admin') redirectPath = '/admin';

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        redirectPath,
      },
      message: 'Logged in successfully',
    });

    await setAuthCookie(response, token);
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Login failed' } },
      { status: 500 }
    );
  }
}
