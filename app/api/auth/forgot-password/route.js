import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PasswordReset from '@/models/PasswordReset';
import { forgotPasswordSchema } from '@/lib/validations';
import { sendOtpEmail } from '@/lib/email';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const parseResult = forgotPasswordSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: { message: parseResult.error.errors[0].message } },
        { status: 400 }
      );
    }

    const { email } = parseResult.data;
    const user = await User.findOne({ email: email.toLowerCase() });

    // Security best practice: don't expose user existence, but send OTP if user exists
    if (user) {
      // Delete existing resets for user
      await PasswordReset.deleteMany({ user: user._id });

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpHash = await bcrypt.hash(otp, 10);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await PasswordReset.create({
        user: user._id,
        otpHash,
        expiresAt,
        verified: false,
      });

      await sendOtpEmail(user.email, otp);
    }

    return NextResponse.json({
      success: true,
      data: { email },
      message: 'If that email is registered, a 6-digit OTP has been sent.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to process forgot password request' } },
      { status: 500 }
    );
  }
}
