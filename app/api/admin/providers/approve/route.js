import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Provider from '@/models/Provider';
import User from '@/models/User';
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
        title: 'Account Approved!',
        message: 'Congratulations! Your Local Hands provider application has been approved by admin. You can now login and receive job requests.',
      });
    }

    return NextResponse.json({
      success: true,
      data: { provider },
      message: 'Provider approved successfully',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to approve provider' } },
      { status: 500 }
    );
  }
}
