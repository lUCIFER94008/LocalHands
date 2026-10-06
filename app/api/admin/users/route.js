import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { requireRole } from '@/lib/permissions';

export async function GET(req) {
  const { error } = await requireRole('admin');
  if (error) return error;

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const role = searchParams.get('role');

    const query = {};
    if (role && role !== 'all') {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: users.map((u) => ({ ...u, id: u._id.toString(), _id: u._id.toString() })),
      message: 'Users fetched',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to fetch users' } },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const { error } = await requireRole('admin');
  if (error) return error;

  try {
    await dbConnect();
    const body = await req.json();
    const { userId, isActive } = body;

    const userDoc = await User.findById(userId);
    if (!userDoc) {
      return NextResponse.json(
        { success: false, error: { message: 'User not found' } },
        { status: 404 }
      );
    }

    userDoc.isActive = Boolean(isActive);
    await userDoc.save();

    return NextResponse.json({
      success: true,
      data: { user: userDoc },
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to update user status' } },
      { status: 500 }
    );
  }
}
