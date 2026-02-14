import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import Booking from '@/lib/models/Booking';
import { auth } from '@/auth';

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // In Next.js App Router dynamic routes, params are passed as second argument to the handler
    // But since this file is inside [id]/confirm, params should be available here.
    // Wait... the file structure I'm proposing is src/app/api/admin/bookings/[id]/confirm/route.ts
    // In Next.js 13+, params for nested dynamic routes are passed down.
    
    // However, I need to be careful. The [id] is part of the path.
    // The handler receives { params } where params is an object containing dynamic route segments.
    
    const { id } = params;

    const booking = await Booking.findByIdAndUpdate(
      id, 
      { status: 'confirmed' }, 
      { new: true }
    );

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error('Error confirming booking:', error);
    return NextResponse.json({ error: 'Failed to confirm booking' }, { status: 500 });
  }
}
