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

    provider.approvalStatus = 'approved';
    provider.isApproved = true;
    provider.isActive = true;
    await provider.save();

    if (provider.user) {
      provider.user.isActive = true;
      await provider.user.save();

      await createNotification({
        userId: provider.user._id,
        type: 'provider_approved',
        title: 'Account Restored',
        message: 'Your provider account block has been removed. You can now login again.',
      });
    }

    return NextResponse.json({
      success: true,
      data: { provider },
      message: 'Provider unblocked successfully',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to unblock provider' } },
      { status: 500 }
    );
  }
}
