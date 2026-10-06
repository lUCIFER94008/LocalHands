import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Provider from '@/models/Provider';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search');
    const profession = searchParams.get('profession');
    const location = searchParams.get('location');
    const maxPrice = searchParams.get('price');
    const minRating = searchParams.get('rating');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const savedOnly = searchParams.get('savedOnly') === 'true';

    const currentUser = await getCurrentUser();

    // Default query filters for public/customer listing: only approved & active providers
    const query = {
      approvalStatus: 'approved',
      isApproved: true,
      isActive: true,
    };

    if (savedOnly && currentUser) {
      query.savedBy = currentUser._id;
    }

    if (profession && profession !== 'all') {
      query.profession = { $regex: new RegExp(profession, 'i') };
    }

    if (location) {
      query.location = { $regex: new RegExp(location, 'i') };
    }

    if (maxPrice) {
      query.priceFrom = { $lte: Number(maxPrice) };
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const matchingUsers = await User.find({ name: searchRegex }).select('_id');
      const userIds = matchingUsers.map((u) => u._id);

      query.$or = [
        { profession: searchRegex },
        { location: searchRegex },
        { description: searchRegex },
        { user: { $in: userIds } },
      ];
    }

    const total = await Provider.countDocuments(query);
    const pages = Math.ceil(total / limit) || 1;

    const providers = await Provider.find(query)
      .populate('user', 'name email phone profileImage')
      .sort({ rating: -1, totalReviews: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const formatted = providers.map((p) => {
      const isSaved = currentUser ? p.savedBy?.some((id) => id.toString() === currentUser._id.toString()) : false;
      return {
        ...p,
        id: p._id.toString(),
        _id: p._id.toString(),
        name: p.user?.name || 'Service Professional',
        email: p.user?.email,
        phone: p.user?.phone,
        userPhoto: p.user?.profileImage,
        isSaved,
      };
    });

    return NextResponse.json({
      success: true,
      data: formatted,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
      message: 'Providers fetched successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to fetch providers' } },
      { status: 500 }
    );
  }
}
