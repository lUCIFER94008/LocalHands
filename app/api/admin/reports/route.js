import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Provider from '@/models/Provider';
import Service from '@/models/Service';
import User from '@/models/User';
import { requireRole } from '@/lib/permissions';

export async function GET() {
  const { error } = await requireRole('admin');
  if (error) return error;

  try {
    await dbConnect();

    // 1. Booking Status Distribution from MongoDB
    const statusCounts = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const bookingStatusMap = {
      pending: 0,
      accepted: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
      rejected: 0,
    };
    statusCounts.forEach((item) => {
      if (item._id) bookingStatusMap[item._id] = item.count;
    });

    const bookingOverview = [
      { name: 'Completed', value: bookingStatusMap.completed || 0, color: '#10B981' },
      { name: 'Accepted', value: bookingStatusMap.accepted || 0, color: '#2563EB' },
      { name: 'Pending', value: bookingStatusMap.pending || 0, color: '#F59E0B' },
      { name: 'In Progress', value: bookingStatusMap.in_progress || 0, color: '#7C3AED' },
      { name: 'Cancelled', value: bookingStatusMap.cancelled || 0, color: '#EF4444' },
    ];

    // 2. Revenue aggregation by month or category from MongoDB
    const revenueByCategory = await Booking.aggregate([
      { $match: { status: 'completed' } },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceDetail',
        },
      },
      { $unwind: { path: '$serviceDetail', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$serviceDetail.category',
          name: { $first: '$serviceDetail.name' },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedRevenue = revenueByCategory.map((r) => ({
      category: r._id || 'general',
      serviceName: r.name || 'Service',
      revenue: r.revenue,
      bookings: r.count,
    }));

    // 3. User Role Distribution from MongoDB
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProviders = await User.countDocuments({ role: 'provider' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    const userDistribution = [
      { name: 'Customers', count: totalCustomers, fill: '#2563EB' },
      { name: 'Providers', count: totalProviders, fill: '#7C3AED' },
      { name: 'Admins', count: totalAdmins, fill: '#0B1220' },
    ];

    // 4. Provider Performance List
    const topProviders = await Provider.find({ approvalStatus: 'approved' })
      .populate('user', 'name profileImage')
      .sort({ rating: -1, totalReviews: -1 })
      .limit(5)
      .lean();

    const providerPerformance = topProviders.map((p) => ({
      name: p.user?.name || p.profession,
      profession: p.profession,
      rating: p.rating,
      totalReviews: p.totalReviews,
      location: p.location,
    }));

    return NextResponse.json({
      success: true,
      data: {
        bookingOverview,
        revenueByCategory: formattedRevenue,
        userDistribution,
        providerPerformance,
      },
      message: 'Reports data generated from MongoDB',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to generate reports' } },
      { status: 500 }
    );
  }
}
