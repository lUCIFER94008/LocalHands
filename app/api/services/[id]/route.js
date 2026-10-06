import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Service from '@/models/Service';
import { requireRole } from '@/lib/permissions';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const service = await Service.findById(id).lean();

    if (!service) {
      return NextResponse.json(
        { success: false, error: { message: 'Service not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { service: { ...service, id: service._id.toString() } },
      message: 'Service fetched',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to fetch service' } },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const { error } = await requireRole('admin');
  if (error) return error;

  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const service = await Service.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!service) {
      return NextResponse.json(
        { success: false, error: { message: 'Service not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { service },
      message: 'Service updated successfully',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to update service' } },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { error } = await requireRole('admin');
  if (error) return error;

  try {
    await dbConnect();
    const { id } = await params;
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return NextResponse.json(
        { success: false, error: { message: 'Service not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {},
      message: 'Service deleted successfully',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to delete service' } },
      { status: 500 }
    );
  }
}
