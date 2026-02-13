import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/database';
import Service from '@/lib/models/Service';

// GET single service
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    
    const service = await Service.findById(id);
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: service._id,
        name: service.name,
        slug: service.slug,
        category: service.category,
        description: service.description,
        originalPrice: service.originalPrice,
        discountedPrice: service.discountedPrice,
        urgentPrice: service.urgentPrice || 500,
        isPopular: service.isPopular,
        isHomeService: service.isHomeService,
        features: service.features,
      }
    });

  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// UPDATE service
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const updateData = await request.json();

    // Prevent updating immutable fields if necessary, or sanitize
    // distinct from create, we just update what's passed
    
    const service = await Service.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: service,
      message: 'Service updated successfully'
    });

  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
