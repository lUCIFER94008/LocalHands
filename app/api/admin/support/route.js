import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/permissions';

// Simulated in-memory / MongoDB structure for support tickets
const sampleTickets = [
  {
    id: 'TICK-1001',
    user: 'Ramees (Customer)',
    email: 'ramees@test.com',
    subject: 'Rescheduling inquiry for electrician booking',
    priority: 'Medium',
    status: 'Open',
    createdAt: '2026-10-04T10:30:00Z',
  },
  {
    id: 'TICK-1002',
    user: 'Arun Kumar (Provider)',
    email: 'provider@test.com',
    subject: 'Payment payout clarification for September',
    priority: 'High',
    status: 'In Progress',
    createdAt: '2026-10-03T15:10:00Z',
  },
  {
    id: 'TICK-1003',
    user: 'Aneesha V (Provider)',
    email: 'aneesha@test.com',
    subject: 'Profile service location range update request',
    priority: 'Low',
    status: 'Resolved',
    createdAt: '2026-10-01T09:00:00Z',
  },
];

export async function GET() {
  const { error } = await requireRole('admin');
  if (error) return error;

  return NextResponse.json({
    success: true,
    data: sampleTickets,
    message: 'Support tickets retrieved',
  });
}

export async function PUT(req) {
  const { error } = await requireRole('admin');
  if (error) return error;

  try {
    const body = await req.json();
    const { ticketId, status } = body;

    const ticket = sampleTickets.find((t) => t.id === ticketId);
    if (ticket) {
      ticket.status = status;
    }

    return NextResponse.json({
      success: true,
      data: { ticketId, status },
      message: `Support ticket updated to ${status}`,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to update ticket' } },
      { status: 500 }
    );
  }
}
