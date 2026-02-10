"use client";

import { useState } from "react";
import Button from "../ui/Button";
import { ServiceCard } from "../ui/Card";
import { ALL_SERVICES_DATA } from '@/lib/data/services';

type CategoryType = 'pathology' | 'radiology';

const ServicesGrid = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('pathology');

  const handleBook = (serviceId: string) => {
    window.location.href = `/booking?service=${serviceId}`;
  };

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-custom px-4 md:px-6">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Services Covered
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive diagnostic services ranging from advanced imaging to routine pathology tests.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-secondary/50 p-1.5 rounded-xl inline-flex border border-border">
            <button
              onClick={() => setActiveCategory('pathology')}
              className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 border-0 cursor-pointer ${
                activeCategory === 'pathology'
                  ? 'bg-background text-primary shadow-sm ring-1 ring-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Pathology / Lab Services
            </button>
            <button
              onClick={() => setActiveCategory('radiology')}
              className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 border-0 cursor-pointer ${
                activeCategory === 'radiology'
                  ? 'bg-background text-primary shadow-sm ring-1 ring-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Radiology / Imaging Services
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6">
             <h3 className="text-xl font-bold text-foreground">
              {ALL_SERVICES_DATA[activeCategory].title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {ALL_SERVICES_DATA[activeCategory].description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_SERVICES_DATA[activeCategory].items.map((service) => (
              <ServiceCard
                key={service.id}
                service={{
                  id: service.id,
                  name: service.name,
                  originalPrice: service.price || 0,
                  discountedPrice: service.discountedPrice || 0,
                  features: service.features || [],
                  isPopular: service.isPopular,
                  image: service.image || undefined, // Fallback handled in Card
                }}
                onBook={() => handleBook(service.id)}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Button 
            href="/services" 
            variant="outline" 
            size="lg"
            className="px-8"
          >
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;