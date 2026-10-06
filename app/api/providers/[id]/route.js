import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Provider from '@/models/Provider';
import Review from '@/models/Review';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const provider = await Provider.findById(id)
      .populate('user', 'name email phone profileImage')
      .lean();

    if (!provider) {
      return NextResponse.json(
        { success: false, error: { message: 'Provider not found' } },
        { status: 404 }
      );
    }

    const reviews = await Review.find({ provider: provider._id })
      .populate('customer', 'name profileImage')
      .sort({ createdAt: -1 })
      .lean();

    const currentUser = await getCurrentUser();
    const isSaved = currentUser
      ? provider.savedBy?.some((uid) => uid.toString() === currentUser._id.toString())
      : false;

    return NextResponse.json({
      success: true,
      data: {
        provider: {
          ...provider,
          id: provider._id.toString(),
          _id: provider._id.toString(),
          name: provider.user?.name || 'Service Professional',
          email: provider.user?.email,
          phone: provider.user?.phone,
          userPhoto: provider.user?.profileImage,
          isSaved,
        },
        reviews: reviews.map((r) => ({
          ...r,
          id: r._id.toString(),
          _id: r._id.toString(),
          customerName: r.customer?.name || 'Customer',
          customerPhoto: r.customer?.profileImage,
        })),
      },
      message: 'Provider details retrieved',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to fetch provider' } },
      { status: 500 }
    );
  }
}

// POST: Toggle save provider for logged in customer
export async function POST(req, { params }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;

    const provider = await Provider.findById(id);
    if (!provider) {
      return NextResponse.json(
        { success: false, error: { message: 'Provider not found' } },
        { status: 404 }
      );
    }

    const userIndex = provider.savedBy.findIndex(
      (uid) => uid.toString() === currentUser._id.toString()
    );

    let isSaved = false;
    if (userIndex > -1) {
      provider.savedBy.splice(userIndex, 1);
      isSaved = false;
    } else {
      provider.savedBy.push(currentUser._id);
      isSaved = true;
    }

    await provider.save();

    return NextResponse.json({
      success: true,
      data: { isSaved },
      message: isSaved ? 'Provider saved' : 'Provider removed from saved',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Action failed' } },
      { status: 500 }
    );
  }
}
