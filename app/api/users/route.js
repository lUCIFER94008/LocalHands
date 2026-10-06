import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth } from '@/lib/permissions';

export async function GET() {
  const { error, user } = await requireAuth();
  if (error) return error;

  return NextResponse.json({
    success: true,
    data: { user },
    message: 'User profile retrieved',
  });
}

export async function PUT(req) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    await dbConnect();
    const body = await req.json();
    const { name, phone, profileImage } = body;

    const userDoc = await User.findById(user._id);
    if (!userDoc) {
      return NextResponse.json(
        { success: false, error: { message: 'User not found' } },
        { status: 404 }
      );
    }

    if (name) userDoc.name = name;
    if (phone) userDoc.phone = phone;
    if (profileImage) userDoc.profileImage = profileImage;

    await userDoc.save();

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: userDoc._id,
          name: userDoc.name,
          email: userDoc.email,
          phone: userDoc.phone,
          profileImage: userDoc.profileImage,
          role: userDoc.role,
        },
      },
      message: 'Profile updated successfully',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to update profile' } },
      { status: 500 }
    );
  }
}
