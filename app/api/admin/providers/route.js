import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Provider from '@/models/Provider';
import { requireRole } from '@/lib/permissions';

export async function GET(req) {
  const { error } = await requireRole('admin');
  if (error) return error;

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const query = {};
    if (status && status !== 'all') {
      query.approvalStatus = status;
    }
    if (search) {
      query.$or = [
        { profession: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const providers = await Provider.find(query)
      .populate('user', 'name email phone profileImage isActive')
      .sort({ createdAt: -1 })
      .lean();

    const formatted = providers.map((p) => ({
      ...p,
      id: p._id.toString(),
      _id: p._id.toString(),
      name: p.user?.name || 'Applicant',
      email: p.user?.email,
      phone: p.user?.phone,
      photo: p.profilePhoto || p.user?.profileImage,
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
      message: 'Providers fetched for admin',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to fetch providers' } },
      { status: 500 }
    );
  }
}
