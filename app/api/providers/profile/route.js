import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Provider from '@/models/Provider';
import User from '@/models/User';
import { requireRole } from '@/lib/permissions';

export async function GET() {
  const { error, user } = await requireRole('provider');
  if (error) return error;

  try {
    await dbConnect();
    const provider = await Provider.findOne({ user: user._id })
      .populate('user', 'name email phone profileImage')
      .lean();

    if (!provider) {
      return NextResponse.json(
        { success: false, error: { message: 'Provider profile not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { provider },
      message: 'Provider profile retrieved',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Error fetching provider profile' } },
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
    const { name, phone, profession, experience, location, priceFrom, description, services, profilePhoto, isAvailable } = body;

    const userDoc = await User.findById(user._id);
    if (name) userDoc.name = name;
    if (phone) userDoc.phone = phone;
    if (profilePhoto) userDoc.profileImage = profilePhoto;
    await userDoc.save();

    const provider = await Provider.findOne({ user: user._id });
    if (!provider) {
      return NextResponse.json(
        { success: false, error: { message: 'Provider profile not found' } },
        { status: 404 }
      );
    }

    if (profession) provider.profession = profession;
    if (experience) provider.experience = experience;
    if (location) provider.location = location;
    if (priceFrom !== undefined) provider.priceFrom = Number(priceFrom);
    if (description !== undefined) provider.description = description;
    if (services && Array.isArray(services)) provider.services = services;
    if (profilePhoto) provider.profilePhoto = profilePhoto;
    if (isAvailable !== undefined) provider.isAvailable = Boolean(isAvailable);

    await provider.save();

    return NextResponse.json({
      success: true,
      data: { provider },
      message: 'Provider profile updated successfully',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to update provider profile' } },
      { status: 500 }
    );
  }
}
