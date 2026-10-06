import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({
      success: true,
      data: { status: 'healthy', database: 'connected', timestamp: new Date() },
      message: 'System operational',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: 'Database connection failed', details: error.message } },
      { status: 500 }
    );
  }
}
