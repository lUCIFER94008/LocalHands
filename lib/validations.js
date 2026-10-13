import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['customer', 'provider', 'admin']).optional(),
});

export const customerRegisterSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const providerRegisterSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
    profession: z.string().min(2, { message: 'Profession is required' }),
    experience: z.string().min(1, { message: 'Experience is required' }),
    location: z.string().min(2, { message: 'Location is required' }),
    priceFrom: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
    description: z.string().optional(),
    services: z.array(z.string()).optional(),
    profilePhoto: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export const verifyOtpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  otp: z.string().length(6, { message: 'OTP must be exactly 6 digits' }),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    otp: z.string().length(6, { message: 'OTP must be exactly 6 digits' }),
    newPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const bookingSchema = z.object({
  providerId: z.string().min(1, { message: 'Provider ID is required' }),
  serviceId: z.string().min(1, { message: 'Service ID is required' }),
  bookingDate: z.string().min(1, { message: 'Booking date is required' }),
  bookingTime: z.string().min(1, { message: 'Booking time is required' }),
  address: z.string().min(5, { message: 'Full address is required' }),
  notes: z.string().optional(),
  fullName: z.string().optional(),
  phone: z.string().optional(),
  house: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
});

export const newBookingFormSchema = z.object({
  serviceId: z.string().min(1, { message: 'Please select a service' }),
  bookingDate: z.string().min(1, { message: 'Please select a booking date' }),
  bookingTime: z.string().min(1, { message: 'Please select a time slot' }),
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  house: z.string().min(1, { message: 'House / Building name is required' }),
  street: z.string().min(2, { message: 'Street / Area is required' }),
  city: z.string().min(2, { message: 'City is required' }),
  state: z.string().min(2, { message: 'State is required' }),
  pincode: z.string().min(4, { message: 'Valid PIN code is required' }),
  notes: z.string().optional(),
});

export const reviewSchema = z.object({
  bookingId: z.string().min(1, { message: 'Booking ID is required' }),
  rating: z.coerce.number().min(1).max(5, { message: 'Rating must be between 1 and 5' }),
  comment: z.string().min(3, { message: 'Comment must be at least 3 characters' }),
});

export const messageSchema = z.object({
  receiverId: z.string().min(1, { message: 'Receiver ID is required' }),
  bookingId: z.string().optional(),
  message: z.string().min(1, { message: 'Message text cannot be empty' }),
});

export const serviceSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  description: z.string().min(5, { message: 'Description is required' }),
  category: z.string().min(2, { message: 'Category is required' }),
  icon: z.string().default('Wrench'),
  startingPrice: z.coerce.number().min(0, { message: 'Price must be positive' }),
  isActive: z.boolean().default(true),
});

export const providerProfileSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  profession: z.string().min(2),
  experience: z.string().min(1),
  location: z.string().min(2),
  priceFrom: z.coerce.number().min(0),
  description: z.string().optional(),
  isAvailable: z.boolean().optional(),
});
