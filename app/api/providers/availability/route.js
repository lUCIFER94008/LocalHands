import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Provider from '@/models/Provider';
import { requireRole } from '@/lib/permissions';

export async function GET() {
  const { error, user } = await requireRole('provider');
  if (error) return error;

  try {
    await dbConnect();
    const provider = await Provider.findOne({ user: user._id }).lean();
    if (!provider) {
      return NextResponse.json(
        { success: false, error: { message: 'Provider profile not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { availability: provider.availability || [] },
      message: 'Availability schedule fetched',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to fetch availability' } },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const { error, user } = await requireRole('provider');
  if (error) return error;

  try {
    await dbConnect();
    const body = await req.json();
    const { availability } = body;

    if (!Array.isArray(availability)) {
      return NextResponse.json(
        { success: false, error: { message: 'Availability must be an array' } },
        { status: 400 }
      );
    }

    const provider = await Provider.findOne({ user: user._id });
    if (!provider) {
      return NextResponse.json(
        { success: false, error: { message: 'Provider profile not found' } },
        { status: 404 }
      );
    }

    provider.availability = availability;
    await provider.save();

    return NextResponse.json({
      success: true,
      data: { availability: provider.availability },
      message: 'Availability schedule updated successfully',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to update availability' } },
      { status: 500 }
    );
  }
}
