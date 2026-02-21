import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import Booking from '@/lib/models/Booking';
import { auth } from '@/auth';

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = params;
    const data = await req.json();

    const booking = await Booking.findByIdAndUpdate(id, data, { new: true });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Handle Completion Workflows
    if (data.status === 'completed') {
      const { CommissionService } = await import('@/lib/commissions');
      const { NotificationService } = await import('@/lib/notifications');
      
      await CommissionService.processBookingCompletion(id);
      
      await NotificationService.sendReportReady({
        email: booking.patientEmail,
        patientName: booking.patientName,
        serviceName: booking.serviceName,
        reportUrl: booking.reportUrl || `${process.env.NEXTAUTH_URL}/dashboard`,
      });
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = params;

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
