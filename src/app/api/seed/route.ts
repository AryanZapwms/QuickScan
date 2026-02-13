import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import Service from '@/lib/models/Service';
import { servicesData, PATHOLOGY_SERVICES, RADIOLOGY_SERVICES } from '@/lib/data/services';

export async function GET() {
  try {
    await connectDB();
    
    let count = 0;

    // Helper to seed a service item
    const seedService = async (item: any, category: string) => {
      // Check if detailed data exists in servicesData
      const detail = servicesData[item.id] || {};
      
      const serviceData = {
        name: detail.title || item.name,
        slug: item.id,
        category: item.id, // using ID as category for simplicity or map strictly if needed. 
                   // Ideally, we should align this with the enum.
                   // Let's use the item.id/slug as the category if it matches the enum, 
                   // otherwise map it or fallback.
                   // Looking at the data, ids like 'mri', 'ct-scan' match.
                   // 'blood-tests' matches close to 'blood-test'.
        
        description: detail.description || `Book ${item.name} at the best centers.`,
        shortDescription: detail.description?.substring(0, 150),
        originalPrice: detail.originalPrice || (item.price ? item.price * 1.5 : 0),
        discountedPrice: detail.price || item.price || 0,
        urgentPrice: 500, // Default urgent price
        features: detail.features || item.features || [],
        preparationInstructions: detail.preparation || "No specific preparation required unless advised.",
        reportTime: detail.reportTime || "24-48 Hours",
        isPopular: item.isPopular || false,
        isHomeService: item.name.toLowerCase().includes("home") || detail.homeService === "Available",
        updatedAt: new Date()
      };

      // Adjust category to match enum strictly
      // Enum: 'mri', 'ct-scan', 'x-ray', 'health-checkup', 'blood-test', 'ultrasound',
      // 'mammography', 'pet-ct', 'ecg-echo', 'urine-stool', 'thyroid-lipid-diabetes'
      
      let finalCategory = item.id;
      if (item.id === 'blood-tests') finalCategory = 'blood-test';
      
      // Update or Create
      await Service.findOneAndUpdate(
        { slug: item.id },
        { ...serviceData, category: finalCategory },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      count++;
    };

    // Seed Pathology
    for (const item of PATHOLOGY_SERVICES) {
       await seedService(item, 'pathology');
    }

    // Seed Radiology
    for (const item of RADIOLOGY_SERVICES) {
      await seedService(item, 'radiology');
    }

    return NextResponse.json({
      success: true,
      message: `Database seeded successfully with ${count} services.`,
    });

  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { error: error.message || 'Seeding failed' },
      { status: 500 }
    );
  }
}
