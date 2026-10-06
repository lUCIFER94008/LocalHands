import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Provider from '@/models/Provider';
import { requireAuth } from '@/lib/permissions';
import { createNotification } from '@/lib/notifications';

export async function POST(req, { params }) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    await dbConnect();
    const { id } = await params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: { message: 'Booking not found' } },
        { status: 404 }
      );
    }

    let isAuthorized = false;
    if (user.role === 'customer' && booking.customer.toString() === user._id.toString()) {
      isAuthorized = true;
    } else if (user.role === 'admin') {
      isAuthorized = true;
    } else if (user.role === 'provider') {
      const provider = await Provider.findOne({ user: user._id });
      if (provider && booking.provider.toString() === provider._id.toString()) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: { message: 'Forbidden. You do not own this booking.' } },
        { status: 403 }
      );
    }

    if (!['pending', 'accepted'].includes(booking.status)) {
      return NextResponse.json(
        { success: false, error: { message: `Cannot cancel booking with status '${booking.status}'` } },
        { status: 400 }
      );
    }

    booking.status = 'cancelled';
    await booking.save();

    // Send notifications to involved parties
    if (user.role === 'customer') {
      const providerDoc = await Provider.findById(booking.provider).populate('user');
      if (providerDoc?.user) {
        await createNotification({
          userId: providerDoc.user._id,
          type: 'booking_cancelled',
          title: 'Booking Cancelled',
          message: `${user.name} cancelled the booking scheduled for ${booking.bookingDate}.`,
        });
      }
    } else {
      await createNotification({
        userId: booking.customer,
        type: 'booking_cancelled',
        title: 'Booking Cancelled',
        message: `Your booking scheduled for ${booking.bookingDate} has been cancelled.`,
      });
    }

    return NextResponse.json({
      success: true,
      data: { booking },
      message: 'Booking cancelled successfully',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to cancel booking' } },
      { status: 500 }
    );
  }
}
