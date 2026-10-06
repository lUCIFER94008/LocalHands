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

    if (booking.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: { message: `Cannot reject booking with status '${booking.status}'` } },
        { status: 400 }
      );
    }

    booking.status = 'rejected';
    await booking.save();

    await createNotification({
      userId: booking.customer,
      type: 'booking_rejected',
      title: 'Booking Request Update',
      message: `${user.name} was unable to accept your booking request for ${booking.bookingDate}.`,
    });

    return NextResponse.json({
      success: true,
      data: { booking },
      message: 'Booking request rejected',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to reject booking' } },
      { status: 500 }
    );
  }
}
