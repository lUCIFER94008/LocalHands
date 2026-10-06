import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Provider from '@/models/Provider';
import { hashPassword, signToken, setAuthCookie } from '@/lib/auth';
import { customerRegisterSchema, providerRegisterSchema } from '@/lib/validations';
import { createNotification } from '@/lib/notifications';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const role = body.role || 'customer';

    if (role === 'customer') {
      const parseResult = customerRegisterSchema.safeParse(body);
      if (!parseResult.success) {
        return NextResponse.json(
          { success: false, error: { message: parseResult.error.errors[0].message } },
          { status: 400 }
        );
      }

      const { name, email, phone, password } = parseResult.data;

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: { message: 'Email address is already registered' } },
          { status: 400 }
        );
      }

      const hashedPassword = await hashPassword(password);
      const user = await User.create({
        name,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
        role: 'customer',
        isActive: true,
      });

      const token = signToken({ userId: user._id.toString(), role: 'customer' });

      const response = NextResponse.json({
        success: true,
        data: {
          user: { id: user._id, name: user.name, email: user.email, role: user.role },
        },
        message: 'Account created successfully',
      });

      await setAuthCookie(response, token);
      return response;
    } else if (role === 'provider') {
      const parseResult = providerRegisterSchema.safeParse(body);
      if (!parseResult.success) {
        return NextResponse.json(
          { success: false, error: { message: parseResult.error.errors[0].message } },
          { status: 400 }
        );
      }

      const {
        name,
        email,
        phone,
        password,
        profession,
        experience,
        location,
        priceFrom,
        description,
        services,
      } = parseResult.data;

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: { message: 'Email address is already registered' } },
          { status: 400 }
        );
      }

      const profilePhoto = body.profilePhoto || '/uploads/providers/default-provider.jpg';
      const hashedPassword = await hashPassword(password);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
        role: 'provider',
        profileImage: profilePhoto,
        isActive: false, // Inactive until approved
      });

      const defaultAvailability = [
        { day: 'Monday', enabled: true, startTime: '09:00', endTime: '18:00' },
        { day: 'Tuesday', enabled: true, startTime: '09:00', endTime: '18:00' },
        { day: 'Wednesday', enabled: true, startTime: '09:00', endTime: '18:00' },
        { day: 'Thursday', enabled: true, startTime: '09:00', endTime: '18:00' },
        { day: 'Friday', enabled: true, startTime: '09:00', endTime: '18:00' },
        { day: 'Saturday', enabled: true, startTime: '10:00', endTime: '16:00' },
        { day: 'Sunday', enabled: false, startTime: '09:00', endTime: '18:00' },
      ];

      const provider = await Provider.create({
        user: user._id,
        profession,
        experience,
        location,
        priceFrom,
        description: description || '',
        services: services && services.length > 0 ? services : [profession],
        profilePhoto,
        approvalStatus: 'pending',
        isApproved: false,
        isActive: false,
        isAvailable: true,
        availability: defaultAvailability,
      });

      // Notify admin about new provider application
      const admins = await User.find({ role: 'admin' }).select('_id');
      for (const admin of admins) {
        await createNotification({
          userId: admin._id,
          type: 'provider_pending',
          title: 'New Provider Registration',
          message: `${name} has applied as a ${profession} in ${location}.`,
        });
      }

      return NextResponse.json({
        success: true,
        data: {
          user: { id: user._id, name: user.name, email: user.email, role: user.role },
          provider: { id: provider._id, approvalStatus: provider.approvalStatus },
        },
        message: 'Provider registration submitted successfully. Your account is pending admin approval.',
      });
    } else {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid registration role' } },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Registration failed' } },
      { status: 500 }
    );
  }
}
