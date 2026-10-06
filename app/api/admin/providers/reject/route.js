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
    const { providerId, reason } = body;

    const provider = await Provider.findById(providerId).populate('user');
    if (!provider) {
      return NextResponse.json(
        { success: false, error: { message: 'Provider profile not found' } },
        { status: 404 }
      );
    }

    provider.approvalStatus = 'rejected';
    provider.isApproved = false;
    provider.isActive = false;
    await provider.save();

    if (provider.user) {
      await createNotification({
        userId: provider.user._id,
        type: 'provider_rejected',
        title: 'Application Status Update',
        message: `Your provider application was not approved. ${reason ? `Reason: ${reason}` : ''}`,
      });
    }

    return NextResponse.json({
      success: true,
      data: { provider },
      message: 'Provider application rejected',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to reject provider' } },
      { status: 500 }
    );
  }
}
