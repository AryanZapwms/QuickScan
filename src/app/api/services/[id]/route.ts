import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import Service from '@/lib/models/Service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    // Validate ID format if necessary
    
    const service = await Service.findById(id).select('name urgentPrice originalPrice discountedPrice');
    
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: service._id,
        name: service.name,
        urgentPrice: service.urgentPrice || 500,
        originalPrice: service.originalPrice,
        discountedPrice: service.discountedPrice
      }
    });

  } catch (error) {
    console.error('Error fetching public service details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
