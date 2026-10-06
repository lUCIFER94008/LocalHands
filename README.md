# Local Hands - Full-Stack Local Service Marketplace

# Local Hands
### Your Local Service Partner

Local Hands is a complete full-stack web application built using **Next.js App Router**, **React**, **MongoDB & Mongoose**, **Tailwind CSS v4**, **Framer Motion**, **bcryptjs**, and **JWT HTTP-only cookies**. It connects homeowners with background-verified service experts (electricians, plumbers, carpenters, painters, AC technicians, cleaning experts, appliance repair specialists) with real-time booking, messaging, reviews, provider approvals, and analytical dashboards.

---

## 🚀 Key Features

### 1. Public & Landing Experience
- **Hero & Search**: Search by service category, location, and key phrases.
- **Service Categories**: Grid of categories with icon, description, and starting prices.
- **Top Professionals**: Showcases verified local service providers with live ratings and reviews.
- **Onboarding Tour**: Interactive 3-slide introduction to Local Hands features.
- **Split-Screen Authentication**: Clean customer vs provider login and registration with file upload support.
- **Password Reset with OTP**: Secure 6-digit OTP email reset workflow.

### 2. Customer Dashboard & Portal
- **Service & Provider Explorer**: Real-time MongoDB filtering by category, location, rating, and price.
- **Interactive Booking Wizard**: 4-step wizard (Service -> Date & Time -> Address -> Confirm & Pay).
- **Booking Management**: Tabs for Upcoming, Completed, and Cancelled bookings with real-time status transitions.
- **Reviews & Ratings**: Customer rating submission for completed bookings with automatic provider rating recalculation.
- **Database-Backed Messaging**: Direct chat with service professionals.
- **Saved Providers**: Bookmark favorite providers persisted in MongoDB.

### 3. Service Provider Dashboard & Portal
- **Approval System**: New provider accounts undergo administrative approval before receiving requests.
- **Dashboard Statistics**: Real-time totals for bookings, pending requests, completed jobs, and earnings computed via MongoDB aggregations.
- **Booking Requests Workflow**: Accept or reject pending booking requests.
- **Job Lifecycle Controls**: Transitions from `accepted` -> `in_progress` -> `completed`.
- **Earnings Analytics**: Revenue trends visualized with Recharts.
- **Availability Schedule**: Custom working days and hours editor (Monday - Sunday).

### 4. Admin Management Console
- **Platform Analytics**: Total users, providers, bookings, revenue, and category performance.
- **Provider Approvals**: Approve, reject, block, or unblock service provider applications with automated notification triggers.
- **User Management**: View, filter, activate, or deactivate user accounts.
- **Service Catalog CRUD**: Add, edit, or delete platform services with starting prices and icons.
- **Bookings Oversight**: View and filter all system bookings.
- **Support Tickets**: Support ticket management interface.

---

## 🛠️ Technology Stack

- **Framework**: Next.js (App Router)
- **Frontend**: React, JavaScript (JSX)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`, PostCSS)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Form Handling**: React Hook Form + Zod (`@hookform/resolvers`)
- **Data Visualization**: Recharts
- **Database**: MongoDB & Mongoose
- **Authentication**: JWT signed tokens stored in secure `httpOnly` cookies + bcryptjs password hashing
- **Security & Authorization**: Server-side role checks (`customer`, `provider`, `admin`) and middleware protection
- **Email Service**: Nodemailer for OTP delivery
- **File Uploads**: Server-side image storage in `/public/uploads/providers` with file type validation

---

## 📁 Project Structure

```text
local-hands/
│
├── app/
│   ├── layout.jsx
│   ├── page.jsx
│   ├── globals.css
│   ├── loading.jsx
│   ├── not-found.jsx
│   ├── error.jsx
│   │
│   ├── onboarding/page.jsx
│   ├── login/page.jsx
│   ├── register/page.jsx
│   ├── forgot-password/page.jsx
│   ├── reset-password/page.jsx
│   │
│   ├── customer/
│   │   ├── layout.jsx
│   │   ├── page.jsx
│   │   ├── services/page.jsx
│   │   ├── providers/page.jsx & [id]/page.jsx
│   │   ├── bookings/page.jsx & [id]/page.jsx
│   │   ├── messages/page.jsx
│   │   ├── notifications/page.jsx
│   │   ├── saved/page.jsx
│   │   ├── profile/page.jsx
│   │   └── settings/page.jsx
│   │
│   ├── provider/
│   │   ├── layout.jsx
│   │   ├── page.jsx
│   │   ├── requests/page.jsx
│   │   ├── active/page.jsx
│   │   ├── completed/page.jsx
│   │   ├── earnings/page.jsx
│   │   ├── messages/page.jsx
│   │   ├── notifications/page.jsx
│   │   ├── profile/page.jsx
│   │   └── settings/page.jsx
│   │
│   ├── admin/
│   │   ├── layout.jsx
│   │   ├── page.jsx
│   │   ├── users/page.jsx
│   │   ├── providers/page.jsx
│   │   ├── services/page.jsx
│   │   ├── bookings/page.jsx
│   │   ├── support/page.jsx
│   │   ├── reports/page.jsx
│   │   ├── notifications/page.jsx
│   │   └── settings/page.jsx
│   │
│   └── api/ (Next.js Route Handlers)
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── auth/
│   ├── landing/
│   ├── customer/
│   ├── provider/
│   ├── admin/
│   ├── booking/
│   ├── messaging/
│   └── animations/
│
├── lib/
│   ├── mongodb.js
│   ├── auth.js
│   ├── permissions.js
│   ├── validations.js
│   ├── constants.js
│   ├── utils.js
│   ├── api.js
│   ├── email.js
│   ├── upload.js
│   └── notifications.js
│
├── models/
│   ├── User.js
│   ├── Provider.js
│   ├── Service.js
│   ├── Booking.js
│   ├── Review.js
│   ├── Message.js
│   ├── Notification.js
│   └── PasswordReset.js
│
├── scripts/
│   └── seed.js
│
├── middleware.js
├── next.config.mjs
├── postcss.config.mjs
├── jsconfig.json
├── package.json
└── README.md
```

---

## ⚡ Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env.local` in the root directory:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/localhands
JWT_SECRET=local_hands_jwt_secret_key_2026_super_secure_token
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@localhands.com
EMAIL_PASSWORD=app_password_here
EMAIL_FROM="Local Hands <noreply@localhands.com>"
```

### 3. Seed Database

Run the seed script to populate sample services, admin, customers, service providers, bookings, and reviews:

```bash
npm run seed
```

#### Demo Test Accounts (Created by Seed Script):

- **Customer Account**:
  - Email: `ramees@test.com`
  - Password: `123456`
  - Role: `customer`

- **Approved Provider Account**:
  - Email: `provider@test.com`
  - Password: `123456`
  - Profession: `Electrician`

- **Admin Account**:
  - Email: `admin@test.com`
  - Password: `123456`
  - Role: `admin`

### 4. Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your web browser.

### 5. Build for Production

```bash
npm run build
npm start
```

---

## 🔒 Security & Authorization Rules

1. **Authentication**: Handled via JWT tokens set in HTTP-only, `sameSite: lax` cookies. Tokens are never exposed to `localStorage` or client state.
2. **Role Restrictions**:
   - Customers can only view/manage their own bookings, profile, and messages.
   - Providers can only access provider dashboards after administrative approval (`approvalStatus === 'approved'`).
   - Admins exclusively access `/admin` APIs and UI routes.
3. **Backend Validation**: All API inputs are validated using **Zod** schemas.
4. **Booking Pricing**: Base rates, GST/tax calculations (18%), and total amounts are calculated on the server to prevent client price manipulation.
