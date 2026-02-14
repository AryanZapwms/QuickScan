import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import Lab from '@/lib/models/Lab';
import { auth } from '@/auth';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = params;

    const lab = await Lab.findById(id);

    if (!lab) {
      return NextResponse.json({ error: 'Lab not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: lab });
  } catch (error) {
    console.error('Error fetching lab:', error);
    return NextResponse.json({ error: 'Failed to fetch lab' }, { status: 500 });
  }
}

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

    const lab = await Lab.findByIdAndUpdate(id, data, { new: true });

    if (!lab) {
      return NextResponse.json({ error: 'Lab not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: lab });
  } catch (error) {
    console.error('Error updating lab:', error);
    return NextResponse.json({ error: 'Failed to update lab' }, { status: 500 });
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

    const lab = await Lab.findByIdAndDelete(id);

    if (!lab) {
      return NextResponse.json({ error: 'Lab not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Lab deleted successfully' });
  } catch (error) {
    console.error('Error deleting lab:', error);
    return NextResponse.json({ error: 'Failed to delete lab' }, { status: 500 });
  }
}
