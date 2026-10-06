require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/localhands';


// Define Inline Schemas for Seed Script
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: '' },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'provider', 'admin'], default: 'customer' },
    profileImage: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ProviderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    profession: { type: String, required: true },
    profilePhoto: { type: String, default: '' },
    description: { type: String, default: '' },
    experience: { type: String, default: '1 year' },
    services: [{ type: String }],
    location: { type: String, required: true },
    priceFrom: { type: Number, required: true, default: 299 },
    rating: { type: Number, default: 5.0 },
    totalReviews: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: true },
    approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected', 'blocked'], default: 'approved' },
    isApproved: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    availability: [
      {
        day: String,
        enabled: Boolean,
        startTime: String,
        endTime: String,
      },
    ],
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const ServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, required: true },
    icon: { type: String, default: 'Wrench' },
    startingPrice: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const BookingSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    bookingDate: { type: String, required: true },
    bookingTime: { type: String, required: true },
    address: { type: String, required: true },
    notes: { type: String, default: '' },
    price: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

const ReviewSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    rating: { type: Number, required: true },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Provider = mongoose.models.Provider || mongoose.model('Provider', ProviderSchema);
const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

async function seed() {
  try {
    console.log('Connecting to MongoDB:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('Database connected successfully.');

    // Clear existing data
    await User.deleteMany({});
    await Provider.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    console.log('Existing collections cleared.');

    const hashedPassword = await bcrypt.hash('123456', 10);

    // 1. Create Services
    const sampleServices = [
      {
        name: 'Electrician Services',
        description: 'Complete electrical repairs, wiring, DB box installation, light fittings & appliance setup.',
        category: 'electrician',
        icon: 'Zap',
        startingPrice: 499,
        isActive: true,
      },
      {
        name: 'Plumbing & Pipefitting',
        description: 'Leak detection, pipe repairs, bathroom fittings, water heater setup & drainage clearing.',
        category: 'plumber',
        icon: 'Droplets',
        startingPrice: 449,
        isActive: true,
      },
      {
        name: 'Carpentry & Woodwork',
        description: 'Custom furniture repair, door lock installation, modular cabinets & shelf fixing.',
        category: 'carpenter',
        icon: 'Hammer',
        startingPrice: 499,
        isActive: true,
      },
      {
        name: 'Painting & Waterproofing',
        description: 'Interior wall painting, texture finish, exterior coating & dampness waterproofing.',
        category: 'painter',
        icon: 'Paintbrush',
        startingPrice: 899,
        isActive: true,
      },
      {
        name: 'AC Repair & Servicing',
        description: 'Deep AC cleaning, gas top-up, compressor repair & new split AC installation.',
        category: 'ac_service',
        icon: 'Wind',
        startingPrice: 599,
        isActive: true,
      },
      {
        name: 'Deep Home Cleaning',
        description: 'Full house deep cleaning, bathroom sanitization, sofa shampooing & kitchen degreasing.',
        category: 'cleaning',
        icon: 'Sparkles',
        startingPrice: 699,
        isActive: true,
      },
      {
        name: 'Home Appliance Repair',
        description: 'Washing machine, refrigerator, microwave oven & LED TV diagnostics & repair.',
        category: 'appliance_repair',
        icon: 'Tv',
        startingPrice: 349,
        isActive: true,
      },
    ];

    const insertedServices = await Service.insertMany(sampleServices);
    console.log(`Created ${insertedServices.length} services.`);

    // 2. Create Seed Admin
    const adminUser = await User.create({
      name: 'Local Hands Admin',
      email: 'admin@test.com',
      phone: '9876543210',
      password: hashedPassword,
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      isActive: true,
    });
    console.log('Created Admin User: admin@test.com');

    // 3. Create Seed Customer
    const customerUser = await User.create({
      name: 'Ramees',
      email: 'ramees@test.com',
      phone: '9895123456',
      password: hashedPassword,
      role: 'customer',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
      isActive: true,
    });
    console.log('Created Customer User: ramees@test.com');

    // 4. Create Sample Service Providers
    const providerDefs = [
      {
        name: 'Arun Kumar',
        email: 'provider@test.com',
        phone: '9847112233',
        profession: 'Electrician',
        location: 'Kochi, Kerala',
        experience: '6 years',
        priceFrom: 499,
        rating: 4.9,
        totalReviews: 130,
        description: 'Licensed senior electrician with 6+ years of experience in domestic and commercial electrical installations.',
        profilePhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=80',
        serviceCategory: 'electrician',
        approvalStatus: 'approved',
        isApproved: true,
        isActive: true,
      },
      {
        name: 'Shameer K',
        email: 'shameer@test.com',
        phone: '9847223344',
        profession: 'Plumber',
        location: 'Ernakulam, Kerala',
        experience: '5 years',
        priceFrom: 449,
        rating: 4.8,
        totalReviews: 95,
        description: 'Expert plumber specializing in high-pressure piping, bathroom fittings, and emergency pipe repair.',
        profilePhoto: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80',
        serviceCategory: 'plumber',
        approvalStatus: 'approved',
        isApproved: true,
        isActive: true,
      },
      {
        name: 'Riyas Mohammed',
        email: 'riyas@test.com',
        phone: '9847334455',
        profession: 'Carpenter',
        location: 'Kakkanad, Kerala',
        experience: '7 years',
        priceFrom: 499,
        rating: 4.7,
        totalReviews: 82,
        description: 'Master craftsman skilled in custom teak furniture design, modular kitchen assembly, and repair.',
        profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
        serviceCategory: 'carpenter',
        approvalStatus: 'approved',
        isApproved: true,
        isActive: true,
      },
      {
        name: 'Aneesha V',
        email: 'aneesha@test.com',
        phone: '9847445566',
        profession: 'Painter',
        location: 'Edappally, Kerala',
        experience: '4 years',
        priceFrom: 899,
        rating: 4.9,
        totalReviews: 110,
        description: 'Professional interior painter offering Royal Shine finishes, anti-fungal waterproofing, and stencil wall design.',
        profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
        serviceCategory: 'painter',
        approvalStatus: 'approved',
        isApproved: true,
        isActive: true,
      },
      {
        name: 'Suresh Nair',
        email: 'suresh@test.com',
        phone: '9847556677',
        profession: 'AC Service Specialist',
        location: 'Aluva, Kerala',
        experience: '8 years',
        priceFrom: 599,
        rating: 4.8,
        totalReviews: 140,
        description: 'Certified HVAC technician specializing in inverter split AC servicing, PCB repair, and gas refilling.',
        profilePhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
        serviceCategory: 'ac_service',
        approvalStatus: 'approved',
        isApproved: true,
        isActive: true,
      },
      {
        name: 'Manoj P',
        email: 'manoj@test.com',
        phone: '9847667788',
        profession: 'Appliance Repair Expert',
        location: 'Vyttila, Kerala',
        experience: '3 years',
        priceFrom: 349,
        rating: 4.6,
        totalReviews: 64,
        description: 'Prompt home visits for washing machine motor repairs, refrigerator cooling diagnostics, and microwave servicing.',
        profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80',
        serviceCategory: 'appliance_repair',
        approvalStatus: 'approved',
        isApproved: true,
        isActive: true,
      },
      {
        name: 'Kiran Joseph (Pending Approval)',
        email: 'kiran@test.com',
        phone: '9847778899',
        profession: 'Cleaning Specialist',
        location: 'Fort Kochi, Kerala',
        experience: '2 years',
        priceFrom: 699,
        rating: 5.0,
        totalReviews: 0,
        description: 'Dedicated cleaning contractor applying for Local Hands provider membership.',
        profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
        serviceCategory: 'cleaning',
        approvalStatus: 'pending',
        isApproved: false,
        isActive: false,
      },
    ];

    const defaultAvailability = [
      { day: 'Monday', enabled: true, startTime: '09:00', endTime: '18:00' },
      { day: 'Tuesday', enabled: true, startTime: '09:00', endTime: '18:00' },
      { day: 'Wednesday', enabled: true, startTime: '09:00', endTime: '18:00' },
      { day: 'Thursday', enabled: true, startTime: '09:00', endTime: '18:00' },
      { day: 'Friday', enabled: true, startTime: '09:00', endTime: '18:00' },
      { day: 'Saturday', enabled: true, startTime: '10:00', endTime: '16:00' },
      { day: 'Sunday', enabled: false, startTime: '09:00', endTime: '18:00' },
    ];

    const createdProviders = [];
    for (const p of providerDefs) {
      const pUser = await User.create({
        name: p.name,
        email: p.email,
        phone: p.phone,
        password: hashedPassword,
        role: 'provider',
        profileImage: p.profilePhoto,
        isActive: p.isActive,
      });

      const matchedService = insertedServices.find((s) => s.category === p.serviceCategory);

      const pDoc = await Provider.create({
        user: pUser._id,
        profession: p.profession,
        profilePhoto: p.profilePhoto,
        description: p.description,
        experience: p.experience,
        services: [p.profession],
        location: p.location,
        priceFrom: p.priceFrom,
        rating: p.rating,
        totalReviews: p.totalReviews,
        isVerified: true,
        approvalStatus: p.approvalStatus,
        isApproved: p.isApproved,
        isAvailable: true,
        isActive: p.isActive,
        availability: defaultAvailability,
        savedBy: p.email === 'provider@test.com' ? [customerUser._id] : [],
      });

      createdProviders.push(pDoc);
    }
    console.log(`Created ${createdProviders.length} providers.`);

    // 5. Create Sample Bookings for Ramees (Customer) and Arun (Provider)
    const arunProvider = createdProviders.find((p) => p.profession === 'Electrician');
    const elecService = insertedServices.find((s) => s.category === 'electrician');

    if (arunProvider && elecService) {
      const b1 = await Booking.create({
        customer: customerUser._id,
        provider: arunProvider._id,
        service: elecService._id,
        bookingDate: '2026-10-10',
        bookingTime: '10:00 AM',
        address: 'House 42, Marine Drive, Kochi, Kerala - 682031',
        notes: 'Please check the main MCB breaker trip and switchboard.',
        price: 499,
        tax: 90,
        totalAmount: 589,
        status: 'accepted',
      });

      const b2 = await Booking.create({
        customer: customerUser._id,
        provider: arunProvider._id,
        service: elecService._id,
        bookingDate: '2026-09-25',
        bookingTime: '02:30 PM',
        address: 'House 42, Marine Drive, Kochi, Kerala - 682031',
        notes: 'Chandelier light fixing in living room.',
        price: 499,
        tax: 90,
        totalAmount: 589,
        status: 'completed',
      });

      // Review for completed booking
      await Review.create({
        customer: customerUser._id,
        provider: arunProvider._id,
        booking: b2._id,
        rating: 5,
        comment: 'Arun was extremely punctual and fixed our chandelier within 30 minutes! Highly recommended.',
      });

      console.log('Sample bookings and review created successfully.');
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
