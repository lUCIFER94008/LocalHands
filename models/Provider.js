import mongoose from 'mongoose';

const ProviderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    profession: {
      type: String,
      required: [true, 'Profession is required'],
      trim: true,
      index: true,
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    experience: {
      type: String,
      default: '1 year',
    },
    services: [
      {
        type: String,
      },
    ],
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      index: true,
    },
    priceFrom: {
      type: Number,
      required: [true, 'Starting price is required'],
      default: 299,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'blocked'],
      default: 'pending',
      index: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    availability: [
      {
        day: { type: String, required: true },
        enabled: { type: Boolean, default: true },
        startTime: { type: String, default: '09:00' },
        endTime: { type: String, default: '18:00' },
      },
    ],
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Provider || mongoose.model('Provider', ProviderSchema);
