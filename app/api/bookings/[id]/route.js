import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Review from '@/models/Review';
import { requireAuth } from '@/lib/permissions';

export async function GET(req, { params }) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    await dbConnect();
    const { id } = await params;

    const booking = await Booking.findById(id)
      .populate('customer', 'name email phone profileImage')
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name email phone profileImage' },
      })
      .populate('service', 'name category icon startingPrice description')
      .lean();

    if (!booking) {
      return NextResponse.json(
        { success: false, error: { message: 'Booking not found' } },
        { status: 404 }
      );
    }

    const review = await Review.findOne({ booking: booking._id }).lean();

    const formatted = {
      ...booking,
      id: booking._id.toString(),
      _id: booking._id.toString(),
      customerName: booking.customer?.name,
      customerEmail: booking.customer?.email,
      customerPhone: booking.customer?.phone,
      customerPhoto: booking.customer?.profileImage,
      providerName: booking.provider?.user?.name || booking.provider?.profession,
      providerEmail: booking.provider?.user?.email,
      providerPhone: booking.provider?.user?.phone,
      providerPhoto: booking.provider?.profilePhoto || booking.provider?.user?.profileImage,
      providerProfession: booking.provider?.profession,
      providerRating: booking.provider?.rating,
      serviceName: booking.service?.name,
      serviceCategory: booking.service?.category,
      serviceIcon: booking.service?.icon,
      review: review ? { ...review, id: review._id.toString() } : null,
    };

    return NextResponse.json({
      success: true,
      data: { booking: formatted },
      message: 'Booking details fetched',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to fetch booking details' } },
      { status: 500 }
    );
  }
}
