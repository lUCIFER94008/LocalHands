import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { requireAuth } from '@/lib/permissions';

export async function GET() {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    await dbConnect();

    const notifications = await Notification.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const unreadCount = await Notification.countDocuments({
      user: user._id,
      isRead: false,
    });

    const formatted = notifications.map((n) => ({
      ...n,
      id: n._id.toString(),
      _id: n._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        notifications: formatted,
        unreadCount,
      },
      message: 'Notifications fetched',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to fetch notifications' } },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    await dbConnect();
    await Notification.deleteMany({ user: user._id });

    return NextResponse.json({
      success: true,
      data: {},
      message: 'Notifications cleared',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to clear notifications' } },
      { status: 500 }
    );
  }
}
