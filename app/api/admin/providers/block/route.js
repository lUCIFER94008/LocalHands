import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Provider from '@/models/Provider';
import { requireRole } from '@/lib/permissions';
import { createNotification } from '@/lib/notifications';

export async function POST(req) {
  const { error } = await requireRole('admin');
  if (error) return error;

  try {
    await dbConnect();
    const body = await req.json();
    const { providerId } = body;

    const provider = await Provider.findById(providerId).populate('user');
    if (!provider) {
      return NextResponse.json(
        { success: false, error: { message: 'Provider profile not found' } },
        { status: 404 }
      );
    }

    provider.approvalStatus = 'blocked';
    provider.isApproved = false;
    provider.isActive = false;
    await provider.save();

    if (provider.user) {
      provider.user.isActive = false;
      await provider.user.save();

      await createNotification({
        userId: provider.user._id,
        type: 'provider_blocked',
        title: 'Account Blocked',
        message: 'Your provider account has been blocked by administrator. Contact support for assistance.',
      });
    }

    return NextResponse.json({
      success: true,
      data: { provider },
      message: 'Provider blocked successfully',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to block provider' } },
      { status: 500 }
    );
  }
}
