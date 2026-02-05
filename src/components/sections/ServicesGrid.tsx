"use client";

import { useState } from "react";
import Button from "../ui/Button";
import { ServiceCard } from "../ui/Card";
import { ALL_SERVICES_DATA } from "@/lib/data/services";

type CategoryType = 'pathology' | 'radiology';

const ServicesGrid = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('pathology');

  const handleBook = (serviceId: string) => {
    window.location.href = `/booking?service=${serviceId}`;
  };

  return (
    <section className="py-12 md:py-16 bg-gray-50/50">
      <div className="container-custom px-4 md:px-6">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Services Covered
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Comprehensive diagnostic services ranging from advanced imaging to routine pathology tests.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 inline-flex gap-1">
            <button
              onClick={() => setActiveCategory('pathology')}
              className={`px-6 py-2.5 rounded-xl border-none text-sm font-semibold transition-all duration-300 ${
                activeCategory === 'pathology'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Pathology / Lab Services
            </button>
            <button
              onClick={() => setActiveCategory('radiology')}
              className={`px-6 py-2.5 rounded-xl border-none text-sm font-semibold transition-all duration-300 ${
                activeCategory === 'radiology'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Radiology / Imaging Services
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="animate-fadeIn border p-4 rounded-lg border-gray-300 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <div>
               <h3 className="text-xl font-bold text-gray-800">
                {ALL_SERVICES_DATA[activeCategory].title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {ALL_SERVICES_DATA[activeCategory].description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
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
                  image: service.image || "/images/health-checkup.jpg", // Fallback image
                }}
                onBook={() => handleBook(service.id)}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Button 
            href="/services" 
            variant="outline" 
            size="lg"
            className="bg-white hover:bg-gray-50 border-gray-200"
          >
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;