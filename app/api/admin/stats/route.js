import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Provider from '@/models/Provider';
import Booking from '@/models/Booking';
import Service from '@/models/Service';
import { requireRole } from '@/lib/permissions';

export async function GET() {
  const { error } = await requireRole('admin');
  if (error) return error;

  try {
    await dbConnect();

    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProviders = await Provider.countDocuments({});
    const approvedProviders = await Provider.countDocuments({ approvalStatus: 'approved' });
    const pendingProviders = await Provider.countDocuments({ approvalStatus: 'pending' });
    const totalBookings = await Booking.countDocuments({});
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const activeServices = await Service.countDocuments({ isActive: true });

    // Revenue aggregation from completed bookings
    const revenueAggregation = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAggregation[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalProviders,
        approvedProviders,
        pendingProviders,
        totalBookings,
        completedBookings,
        activeServices,
        totalRevenue,
      },
      message: 'Admin platform stats retrieved',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to fetch admin stats' } },
      { status: 500 }
    );
  }
}
