import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import User from '@/models/User';
import { requireAuth } from '@/lib/permissions';
import { messageSchema } from '@/lib/validations';
import { createNotification } from '@/lib/notifications';

export async function GET(req) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const partnerId = searchParams.get('partnerId');

    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: { message: 'partnerId query parameter is required' } },
        { status: 400 }
      );
    }

    // Fetch messages between user and partner
    const messages = await Message.find({
      $or: [
        { sender: user._id, receiver: partnerId },
        { sender: partnerId, receiver: user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    // Mark unread messages sent to current user as read
    await Message.updateMany(
      { sender: partnerId, receiver: user._id, isRead: false },
      { $set: { isRead: true } }
    );

    const formatted = messages.map((m) => ({
      ...m,
      id: m._id.toString(),
      _id: m._id.toString(),
      isSelf: m.sender.toString() === user._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
      message: 'Messages fetched',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to fetch messages' } },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    await dbConnect();
    const body = await req.json();

    const parseResult = messageSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: { message: parseResult.error.errors[0].message } },
        { status: 400 }
      );
    }

    const { receiverId, bookingId, message } = parseResult.data;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return NextResponse.json(
        { success: false, error: { message: 'Message receiver not found' } },
        { status: 404 }
      );
    }

    const newMessage = await Message.create({
      sender: user._id,
      receiver: receiver._id,
      booking: bookingId || null,
      message: message.trim(),
      isRead: false,
    });

    // Notify receiver of new chat message
    await createNotification({
      userId: receiver._id,
      type: 'new_message',
      title: `Message from ${user.name}`,
      message: message.length > 50 ? `${message.substring(0, 50)}...` : message,
    });

    return NextResponse.json({
      success: true,
      data: {
        message: {
          ...newMessage.toObject(),
          id: newMessage._id.toString(),
          _id: newMessage._id.toString(),
          isSelf: true,
        },
      },
      message: 'Message sent',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to send message' } },
      { status: 500 }
    );
  }
}
