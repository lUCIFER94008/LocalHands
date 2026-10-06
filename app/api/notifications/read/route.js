import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { requireAuth } from '@/lib/permissions';

export async function POST(req) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    await dbConnect();
    const body = await req.json().catch(() => ({}));
    const { notificationId } = body;

    if (notificationId) {
      await Notification.updateOne(
        { _id: notificationId, user: user._id },
        { $set: { isRead: true } }
      );
    } else {
      // Mark all as read
      await Notification.updateMany(
        { user: user._id, isRead: false },
        { $set: { isRead: true } }
      );
    }

    return NextResponse.json({
      success: true,
      data: {},
      message: 'Notifications marked as read',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to update notifications' } },
      { status: 500 }
    );
  }
}
