export const BRAND_COLORS = {
  deepNavy: '#0B1220',
  navy: '#172554',
  royalBlue: '#2563EB',
  purple: '#7C3AED',
  softPurple: '#EDE9FE',
  background: '#F8FAFC',
  white: '#FFFFFF',
  text: '#0F172A',
  secondary: '#64748B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

export const SERVICE_CATEGORIES = [
  { id: 'electrician', name: 'Electrician', icon: 'Zap', description: 'Wiring, repairs, lighting & installations', startingPrice: 399 },
  { id: 'plumber', name: 'Plumber', icon: 'Droplets', description: 'Pipes, leaks, drainage & bathroom fittings', startingPrice: 449 },
  { id: 'carpenter', name: 'Carpenter', icon: 'Hammer', description: 'Furniture repair, custom woodwork & fittings', startingPrice: 499 },
  { id: 'painter', name: 'Painter', icon: 'Paintbrush', description: 'Interior/exterior painting & wall texture', startingPrice: 899 },
  { id: 'ac_service', name: 'AC Service', icon: 'Wind', description: 'AC repair, servicing, gas charging & installation', startingPrice: 599 },
  { id: 'cleaning', name: 'Cleaning', icon: 'Sparkles', description: 'Deep home cleaning, sofa & kitchen sanitization', startingPrice: 699 },
  { id: 'appliance_repair', name: 'Appliance Repair', icon: 'Tv', description: 'Washing machine, TV, fridge & microwave repair', startingPrice: 349 },
  { id: 'pest_control', name: 'Pest Control', icon: 'ShieldCheck', description: 'Termite, cockroach, rodent & bedbug treatments', startingPrice: 799 },
];


export const BOOKING_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const PROVIDER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  BLOCKED: 'blocked',
};
