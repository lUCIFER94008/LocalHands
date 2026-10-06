import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const review = await Review.findById(id)
      .populate('customer', 'name profileImage')
      .populate('provider')
      .lean();

    if (!review) {
      return NextResponse.json(
        { success: false, error: { message: 'Review not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { review: { ...review, id: review._id.toString() } },
      message: 'Review detail fetched',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to fetch review' } },
      { status: 500 }
    );
  }
}
