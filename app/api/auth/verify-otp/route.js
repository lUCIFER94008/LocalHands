import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PasswordReset from '@/models/PasswordReset';
import { verifyOtpSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const parseResult = verifyOtpSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: { message: parseResult.error.errors[0].message } },
        { status: 400 }
      );
    }

    const { email, otp } = parseResult.data;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid or expired OTP' } },
        { status: 400 }
      );
    }

    const resetDoc = await PasswordReset.findOne({
      user: user._id,
      expiresAt: { $gt: new Date() },
    });

    if (!resetDoc) {
      return NextResponse.json(
        { success: false, error: { message: 'OTP has expired or is invalid. Please request a new one.' } },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(otp, resetDoc.otpHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: { message: 'Incorrect OTP code.' } },
        { status: 400 }
      );
    }

    resetDoc.verified = true;
    await resetDoc.save();

    return NextResponse.json({
      success: true,
      data: { email },
      message: 'OTP verified successfully.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'OTP verification failed' } },
      { status: 500 }
    );
  }
}
