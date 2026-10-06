import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import User from '@/models/User';
import Provider from '@/models/Provider';
import { requireAuth } from '@/lib/permissions';

export async function GET() {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    await dbConnect();

    // Find all distinct senders or receivers where current user is involved
    const messages = await Message.find({
      $or: [{ sender: user._id }, { receiver: user._id }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name email profileImage role')
      .populate('receiver', 'name email profileImage role')
      .lean();

    const conversationsMap = new Map();

    for (const msg of messages) {
      const isSender = msg.sender?._id?.toString() === user._id.toString();
      const partner = isSender ? msg.receiver : msg.sender;

      if (!partner) continue;

      const partnerId = partner._id.toString();

      if (!conversationsMap.has(partnerId)) {
        // Count unread
        const unreadCount = await Message.countDocuments({
          sender: partner._id,
          receiver: user._id,
          isRead: false,
        });

        // Get provider info if partner is provider
        let providerInfo = null;
        if (partner.role === 'provider') {
          providerInfo = await Provider.findOne({ user: partner._id })
            .select('profession profilePhoto rating')
            .lean();
        }

        conversationsMap.set(partnerId, {
          id: partnerId,
          partnerId,
          name: partner.name,
          email: partner.email,
          photo: providerInfo?.profilePhoto || partner.profileImage,
          role: partner.role,
          profession: providerInfo?.profession || (partner.role === 'customer' ? 'Customer' : 'User'),
          lastMessage: msg.message,
          lastMessageDate: msg.createdAt,
          unreadCount,
        });
      }
    }

    const conversationList = Array.from(conversationsMap.values());

    return NextResponse.json({
      success: true,
      data: conversationList,
      message: 'Conversations fetched successfully',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to fetch conversations' } },
      { status: 500 }
    );
  }
}
