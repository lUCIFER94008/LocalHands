import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { requireRole } from '@/lib/permissions';

export async function GET(req) {
  const { error } = await requireRole('admin');
  if (error) return error;

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone profileImage')
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name email phone profileImage' },
      })
      .populate('service', 'name category icon startingPrice')
      .sort({ createdAt: -1 })
      .lean();

    const formatted = bookings.map((b) => ({
      ...b,
      id: b._id.toString(),
      _id: b._id.toString(),
      customerName: b.customer?.name || 'Customer',
      customerPhone: b.customer?.phone,
      providerName: b.provider?.user?.name || b.provider?.profession || 'Provider',
      serviceName: b.service?.name,
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
      message: 'Admin bookings list fetched',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to fetch admin bookings' } },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const { error } = await requireRole('admin');
  if (error) return error;

  try {
    await dbConnect();
    const body = await req.json();
    const { bookingId, status } = body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: { message: 'Booking not found' } },
        { status: 404 }
      );
    }

    booking.status = status;
    await booking.save();

    return NextResponse.json({
      success: true,
      data: { booking },
      message: `Booking status updated to ${status}`,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to update booking status' } },
      { status: 500 }
    );
  }
}
