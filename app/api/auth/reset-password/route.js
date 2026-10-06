import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PasswordReset from '@/models/PasswordReset';
import { resetPasswordSchema } from '@/lib/validations';
import { hashPassword } from '@/lib/auth';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const parseResult = resetPasswordSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: { message: parseResult.error.errors[0].message } },
        { status: 400 }
      );
    }

    const { email, newPassword } = parseResult.data;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid password reset request' } },
        { status: 400 }
      );
    }

    const resetDoc = await PasswordReset.findOne({
      user: user._id,
      verified: true,
      expiresAt: { $gt: new Date() },
    });

    if (!resetDoc) {
      return NextResponse.json(
        { success: false, error: { message: 'OTP verification expired. Please request a new OTP.' } },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    await PasswordReset.deleteMany({ user: user._id });

    return NextResponse.json({
      success: true,
      data: {},
      message: 'Password reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Password reset failed' } },
      { status: 500 }
    );
  }
}
