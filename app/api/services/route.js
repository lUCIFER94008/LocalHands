import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Service from '@/models/Service';
import { requireRole } from '@/lib/permissions';
import { serviceSchema } from '@/lib/validations';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const query = { isActive: true };
    if (category && category !== 'all') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const services = await Service.find(query).sort({ name: 1 }).lean();

    return NextResponse.json({
      success: true,
      data: services.map((s) => ({ ...s, id: s._id.toString(), _id: s._id.toString() })),
      message: 'Services fetched successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to fetch services' } },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const { error } = await requireRole('admin');
  if (error) return error;

  try {
    await dbConnect();
    const body = await req.json();

    const parseResult = serviceSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: { message: parseResult.error.errors[0].message } },
        { status: 400 }
      );
    }

    const service = await Service.create(parseResult.data);

    return NextResponse.json({
      success: true,
      data: { service },
      message: 'Service created successfully',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to create service' } },
      { status: 500 }
    );
  }
}
