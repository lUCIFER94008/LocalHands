import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import Booking from '@/models/Booking';
import Provider from '@/models/Provider';
import { requireAuth } from '@/lib/permissions';
import { reviewSchema } from '@/lib/validations';
import { createNotification } from '@/lib/notifications';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get('providerId');

    const query = {};
    if (providerId) query.provider = providerId;

    const reviews = await Review.find(query)
      .populate('customer', 'name profileImage')
      .populate('provider', 'profession')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: reviews.map((r) => ({
        ...r,
        id: r._id.toString(),
        _id: r._id.toString(),
        customerName: r.customer?.name || 'Customer',
        customerPhoto: r.customer?.profileImage,
      })),
      message: 'Reviews fetched',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to fetch reviews' } },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    await dbConnect();
    const body = await req.json();

    const parseResult = reviewSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: { message: parseResult.error.errors[0].message } },
        { status: 400 }
      );
    }

    const { bookingId, rating, comment } = parseResult.data;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: { message: 'Booking not found' } },
        { status: 404 }
      );
    }

    if (booking.customer.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, error: { message: 'Forbidden. You do not own this booking.' } },
        { status: 403 }
      );
    }

    if (booking.status !== 'completed') {
      return NextResponse.json(
        { success: false, error: { message: 'Only completed bookings can be reviewed.' } },
        { status: 400 }
      );
    }

    const existingReview = await Review.findOne({ booking: booking._id });
    if (existingReview) {
      return NextResponse.json(
        { success: false, error: { message: 'You have already submitted a review for this booking.' } },
        { status: 400 }
      );
    }

    const review = await Review.create({
      customer: user._id,
      provider: booking.provider,
      booking: booking._id,
      rating: Number(rating),
      comment: comment || '',
    });

    // Update provider average rating and totalReviews
    const providerReviews = await Review.find({ provider: booking.provider });
    const totalCount = providerReviews.length;
    const avgRating =
      providerReviews.reduce((sum, r) => sum + r.rating, 0) / (totalCount || 1);

    const providerDoc = await Provider.findById(booking.provider).populate('user');
    if (providerDoc) {
      providerDoc.rating = Number(avgRating.toFixed(1));
      providerDoc.totalReviews = totalCount;
      await providerDoc.save();

      if (providerDoc.user) {
        await createNotification({
          userId: providerDoc.user._id,
          type: 'review_received',
          title: 'New Customer Review!',
          message: `${user.name} left a ${rating}-star review for your service.`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: { review },
      message: 'Review submitted successfully. Thank you for your feedback!',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to submit review' } },
      { status: 500 }
    );
  }
}
