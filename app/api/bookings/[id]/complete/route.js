import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Provider from '@/models/Provider';
import { requireRole } from '@/lib/permissions';
import { createNotification } from '@/lib/notifications';

export async function POST(req, { params }) {
  const { error, user } = await requireRole('provider');
  if (error) return error;

  try {
    await dbConnect();
    const { id } = await params;

    const provider = await Provider.findOne({ user: user._id });
    if (!provider) {
      return NextResponse.json(
        { success: false, error: { message: 'Provider profile not found' } },
        { status: 404 }
      );
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: { message: 'Booking not found' } },
        { status: 404 }
      );
    }

    if (booking.provider.toString() !== provider._id.toString()) {
      return NextResponse.json(
        { success: false, error: { message: 'Forbidden. This is not your booking.' } },
        { status: 403 }
      );
    }

    if (booking.status !== 'in_progress') {
      return NextResponse.json(
        { success: false, error: { message: `Cannot complete job with status '${booking.status}'. Must be 'in_progress'.` } },
        { status: 400 }
      );
    }

    booking.status = 'completed';
    await booking.save();

    await createNotification({
      userId: booking.customer,
      type: 'job_completed',
      title: 'Service Job Completed!',
      message: `${user.name} completed your service job. Please leave a review!`,
    });

    return NextResponse.json({
      success: true,
      data: { booking },
      message: 'Job marked as completed successfully',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to complete job' } },
      { status: 500 }
    );
  }
}
