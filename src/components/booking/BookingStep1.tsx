'use client';

import { useEffect, useState } from 'react';
import { servicesData } from '@/lib/data/services';
import Button from '../ui/Button';
import { FiCheck, FiHome, FiMapPin, FiAlertCircle } from 'react-icons/fi';

interface Step1Props {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
}

export default function BookingStep1({ data, updateData, nextStep }: Step1Props) {
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState(data.serviceId);

  useEffect(() => {
    // Fetch services from API
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const result = await response.json();
        if (result.success) {
          setServices(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
        // Fallback to static data
        setServices(Object.values(servicesData));
      }
    };
    
    fetchServices();
  }, []);

  const handleServiceSelect = (service: any) => {
    setSelectedService(service.slug || service.id);
    updateData({
      serviceId: service.slug || service.id,
      serviceName: service.name,
      serviceType: service.category,
      baseAmount: service.discountedPrice || service.price
    });
  };

  const handleAppointmentTypeChange = (
    type: "lab-visit" | "home-service"
  ) => {
    // Check if the selected service is MRI/CT
    const serviceName = (data.serviceName || "").toLowerCase();
    const serviceType = (data.serviceType || "").toLowerCase();
    
    const isRestrictedService = 
      serviceName.includes("mri") || 
      serviceName.includes("ct") ||
      serviceType.includes("mri") || 
      serviceType.includes("ct");
    
    // Block Home Service selection for MRI/CT scans
    if (isRestrictedService && type === "home-service") {
      alert("Home service is not available for MRI / CT scans. Please select 'Visit Lab Centre' for these services.");
      return; // Prevent updating appointmentType
    }
    
    updateData({ appointmentType: type });
  };

  // Helper function to check if current service is MRI/CT
  const isRestrictedService = () => {
    if (!data.serviceName && !data.serviceType) return false;
    
    const serviceName = (data.serviceName || "").toLowerCase();
    const serviceType = (data.serviceType || "").toLowerCase();
    
    return (
      serviceName.includes("mri") || 
      serviceName.includes("ct") ||
      serviceType.includes("mri") || 
      serviceType.includes("ct")
    );
  };

  const canProceed = selectedService && data.appointmentType;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Select Service & Type</h2>
      
      {/* Service Selection */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-4">Choose a Service</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.slug || service.id}
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300
                ${selectedService === (service.slug || service.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
                }`}
              onClick={() => handleServiceSelect(service)}
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-lg">{service.name}</h4>
                {selectedService === (service.slug || service.id) && (
                  <FiCheck className="text-blue-600 text-xl" />
                )}
              </div>
              
              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{service.discountedPrice || service.price}
                  </span>
                  {service.originalPrice > service.discountedPrice && (
                    <span className="text-gray-500 line-through ml-2">
                      ₹{service.originalPrice}
                    </span>
                  )}
                </div>
              </div>
              
              <ul className="space-y-2 mb-4">
                {service.features?.slice(0, 3).map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-center text-sm text-gray-600">
                    <FiCheck className="text-green-500 mr-2" size={14} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Type */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Appointment Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lab Visit Card - Always enabled */}
          <div
            className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300
              ${data.appointmentType === 'lab-visit'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
              }`}
            onClick={() => handleAppointmentTypeChange('lab-visit')}
          >
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-lg mr-4 ${
                data.appointmentType === 'lab-visit' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <FiMapPin className={`text-xl ${
                  data.appointmentType === 'lab-visit' ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <h4 className="font-bold text-lg">Visit Lab Centre</h4>
                <p className="text-gray-600 text-sm">Walk-in to our diagnostic center</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <FiCheck className="mr-2" size={14} />
                Advanced equipment available
              </li>
              <li className="flex items-center">
                <FiCheck className="mr-2" size={14} />
                Expert technicians on-site
              </li>
              <li className="flex items-center">
                <FiCheck className="mr-2" size={14} />
                Immediate assistance
              </li>
            </ul>
          </div>

          {/* Home Service Card - Conditionally disabled for MRI/CT */}
          <div
            className={`border-2 rounded-xl p-6 transition-all duration-300 ${
              isRestrictedService() 
                ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-75' 
                : data.appointmentType === 'home-service'
                  ? 'border-green-500 bg-green-50 cursor-pointer'
                  : 'border-gray-200 hover:border-green-300 cursor-pointer'
            }`}
            onClick={() => {
              if (!isRestrictedService()) {
                handleAppointmentTypeChange('home-service');
              }
            }}
          >
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-lg mr-4 ${
                isRestrictedService() 
                  ? 'bg-gray-200' 
                  : data.appointmentType === 'home-service' 
                    ? 'bg-green-100' 
                    : 'bg-gray-100'
              }`}>
                <FiHome className={`text-xl ${
                  isRestrictedService() 
                    ? 'text-gray-500' 
                    : data.appointmentType === 'home-service' 
                      ? 'text-green-600' 
                      : 'text-gray-600'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-lg">Home Service</h4>
                    <p className="text-gray-600 text-sm">Sample collection at your home</p>
                  </div>
                  {isRestrictedService() && (
                    <div className="flex items-center text-amber-600 text-sm bg-amber-50 px-3 py-1 rounded-full">
                      <FiAlertCircle className="mr-1" size={14} />
                      Not available
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {isRestrictedService() ? (
              <div className="mb-4">
                <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium">Home service not available for MRI/CT scans</p>
                  <p className="mt-1">These services require specialized equipment only available at our diagnostic centers.</p>
                </div>
              </div>
            ) : (
              <>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center">
                    <FiCheck className="mr-2" size={14} />
                    Free in metro cities*
                  </li>
                  <li className="flex items-center">
                    <FiCheck className="mr-2" size={14} />
                    Certified phlebotomists
                  </li>
                  <li className="flex items-center">
                    <FiCheck className="mr-2" size={14} />
                    Convenient & safe
                  </li>
                </ul>
                <div className="text-sm text-green-600 font-semibold">
                  + ₹200 charge for home service
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button
          onClick={nextStep}
          disabled={!canProceed}
          variant="primary"
        >
          Continue to Patient Details
        </Button>
      </div>
    </div>
  );
}