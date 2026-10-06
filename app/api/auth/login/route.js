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

    // 1. Find user by lowercase email, selecting password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid email or password.' } },
        { status: 401 }
      );
    }

    // 2. Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: { message: 'Your account has been deactivated. Please contact support.' } },
        { status: 403 }
      );
    }

    // 3. Compare password using bcryptjs
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid email or password.' } },
        { status: 401 }
      );
    }

    // 4. Role matching check for user convenience if tab mismatched
    if (requestedRole && user.role !== requestedRole) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Account is registered as '${user.role.toUpperCase()}'. Please select the '${user.role === 'provider' ? 'Service Provider' : user.role === 'admin' ? 'Admin' : 'Customer'}' tab to log in.`,
          },
        },
        { status: 400 }
      );
    }

    // 5. Provider approval verification (Only applies if user DB role is provider)
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

      if (provider.approvalStatus === 'blocked' || !provider.isActive) {
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

    // 6. Generate JWT payload using authoritative DB role
    const token = signToken({ userId: user._id.toString(), role: user.role });

    // 7. Determine correct dashboard redirect
    let redirectPath = '/customer';
    if (user.role === 'provider') redirectPath = '/provider';
    if (user.role === 'admin') redirectPath = '/admin';

    // 8. Construct safe JSON response (never expose password or secrets)
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
        redirectPath,
      },
      message: 'Login successful',
    });

    // 9. Store JWT in HTTP-only cookie
    await setAuthCookie(response, token);
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: 'Login failed. Please try again.' } },
      { status: 500 }
    );
  }
}

