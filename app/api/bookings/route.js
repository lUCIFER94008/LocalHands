import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Provider from '@/models/Provider';
import Service from '@/models/Service';
import User from '@/models/User';
import { requireAuth } from '@/lib/permissions';
import { bookingSchema } from '@/lib/validations';
import { createNotification } from '@/lib/notifications';

export async function GET(req) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = {};

    if (user.role === 'customer') {
      query.customer = user._id;
    } else if (user.role === 'provider') {
      const provider = await Provider.findOne({ user: user._id });
      if (!provider) {
        return NextResponse.json({ success: true, data: [], message: 'No provider profile' });
      }
      query.provider = provider._id;
    } else if (user.role === 'admin') {
      // Admin sees all bookings
    }

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
      customerPhone: b.customer?.phone || '',
      customerPhoto: b.customer?.profileImage,
      providerName: b.provider?.user?.name || b.provider?.profession || 'Provider',
      providerPhoto: b.provider?.profilePhoto || b.provider?.user?.profileImage,
      providerProfession: b.provider?.profession,
      providerPhone: b.provider?.user?.phone,
      serviceName: b.service?.name || 'Home Service',
      serviceIcon: b.service?.icon || 'Wrench',
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
      message: 'Bookings retrieved',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to fetch bookings' } },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const { error, user } = await requireAuth();
  if (error) return error;

  if (user.role !== 'customer') {
    return NextResponse.json(
      { success: false, error: { message: 'Only customer accounts can create bookings.' } },
      { status: 403 }
    );
  }

  try {
    await dbConnect();
    const body = await req.json();

    const parseResult = bookingSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: { message: parseResult.error.errors[0].message } },
        { status: 400 }
      );
    }

    const { providerId, serviceId, bookingDate, bookingTime, address, notes } = parseResult.data;

    const provider = await Provider.findById(providerId).populate('user');
    if (
      !provider ||
      provider.approvalStatus !== 'approved' ||
      !provider.isApproved ||
      provider.isActive === false ||
      provider.isAvailable === false
    ) {
      return NextResponse.json(
        { success: false, error: { message: 'Selected provider is not available for bookings.' } },
        { status: 400 }
      );
    }

    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return NextResponse.json(
        { success: false, error: { message: 'Selected service is no longer available.' } },
        { status: 400 }
      );
    }

    // Verify booking date is not in the past (compare YYYY-MM-DD in local time)
    const todayStr = new Date().toISOString().split('T')[0];
    if (bookingDate < todayStr) {
      return NextResponse.json(
        { success: false, error: { message: 'Booking date cannot be in the past.' } },
        { status: 400 }
      );
    }

    // Validate provider day-of-week availability if configured
    if (Array.isArray(provider.availability) && provider.availability.length > 0) {
      const selectedDayName = new Date(bookingDate + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
      });
      const dayAvail = provider.availability.find(
        (a) => a.day?.toLowerCase() === selectedDayName.toLowerCase()
      );
      if (dayAvail && dayAvail.enabled === false) {
        return NextResponse.json(
          { success: false, error: { message: `Provider is not available on ${selectedDayName}s.` } },
          { status: 400 }
        );
      }
    }

    // If structured address components were passed, format cleanly
    let finalAddress = address;
    if (body.house && body.street && body.city) {
      finalAddress = `${body.house}, ${body.street}, ${body.city}, ${body.state || ''} ${body.pincode ? `- ${body.pincode}` : ''}`.trim();
    }

    // Backend calculation of price & taxes to prevent client price tampering
    const basePrice = service.startingPrice || provider.priceFrom || 299;
    const tax = Math.round(basePrice * 0.18); // 18% GST/Tax
    const totalAmount = basePrice + tax;

    const booking = await Booking.create({
      customer: user._id,
      provider: provider._id,
      service: service._id,
      bookingDate,
      bookingTime,
      address: finalAddress,
      notes: notes || '',
      price: basePrice,
      tax,
      totalAmount,
      status: 'pending',
    });

    // Notify Provider about new booking request
    if (provider.user) {
      await createNotification({
        userId: provider.user._id,
        type: 'booking_created',
        title: 'New Booking Request',
        message: `New request from ${user.name} for ${service.name} on ${bookingDate} at ${bookingTime}.`,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        booking: {
          id: booking._id.toString(),
          bookingId: booking._id.toString(),
          providerName: provider.user?.name || provider.profession,
          serviceName: service.name,
          bookingDate: booking.bookingDate,
          bookingTime: booking.bookingTime,
          price: booking.price,
          tax: booking.tax,
          totalAmount: booking.totalAmount,
          status: booking.status,
        },
      },
      message: 'Booking request created successfully',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to create booking' } },
      { status: 500 }
    );
  }
}
