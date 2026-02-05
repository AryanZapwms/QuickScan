'use client';

import { useState } from 'react';
import Button from '../ui/Button';
import { FiSearch, FiMapPin, FiCalendar } from 'react-icons/fi';
import { ALL_SERVICES_DATA } from '@/lib/data/services';

const HeroSection = () => {
  const [location, setLocation] = useState('Mumbai');
  const [service, setService] = useState('MRI');

  // Combine all services for the dropdown
  const services = [
    ...ALL_SERVICES_DATA.radiology.items.map(s => s.name),
    ...ALL_SERVICES_DATA.pathology.items.map(s => s.name)
  ];
  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune'];

  const handleSearch = () => {
    // Implement search logic
    console.log('Searching for:', { service, location });
  };

  return (
    <section className="relative bg-gradient-to-r from-blue-50 to-indigo-50/50 pt-8 pb-10 md:pt-12 md:pb-16 overflow-hidden">
      <div className="container-custom px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 text-center lg:text-left">
            {/* Heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-5 leading-tight tracking-tight">
              Book Medical Scans & Tests 
              <span className="text-blue-600 block mt-1">
                With Instant Appointment
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              India&apos;s largest network of diagnostic labs. 950+ scan centers, 
              same-day reports, and home sample collection available.
            </p>
            
            {/* Search Box */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 md:p-3 mb-6 md:mb-8 max-w-2xl mx-auto lg:mx-0">
              <div className="flex flex-col md:flex-row gap-2">
                {/* Location */}
                <div className="relative md:w-1/3">
                  <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select 
                    className="w-full pl-9 pr-2 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                
                {/* Service */}
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select 
                    className="w-full pl-9 pr-2 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                  >
                    {services.map((srv) => (
                      <option key={srv} value={srv}>{srv}</option>
                    ))}
                  </select>
                </div>
                
                {/* Search Button */}
                <Button 
                  onClick={handleSearch}
                  variant="primary"
                  className="py-2.5 px-4 text-sm w-full md:w-auto border-0 whitespace-nowrap"
                >
                  <FiCalendar className="inline mr-2 w-4 h-4" />
                  Book Now
                </Button>
              </div>
            </div>
            
            {/* Features */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-4">
              <div className="flex items-center bg-white/60 backdrop-blur-sm border border-gray-100 rounded-full px-3 py-1.5 shadow-sm">
                <span className="text-green-600 bg-green-100 rounded-full p-1 mr-2 text-xs">✓</span>
                <span className="font-medium text-xs text-gray-700">Same Day Reports</span>
              </div>
              <div className="flex items-center bg-white/60 backdrop-blur-sm border border-gray-100 rounded-full px-3 py-1.5 shadow-sm">
                 <span className="text-blue-600 bg-blue-100 rounded-full p-1 mr-2 text-xs">🏠</span>
                <span className="font-medium text-xs text-gray-700">Home Service</span>
              </div>
              <div className="flex items-center bg-white/60 backdrop-blur-sm border border-gray-100 rounded-full px-3 py-1.5 shadow-sm">
                 <span className="text-purple-600 bg-purple-100 rounded-full p-1 mr-2 text-xs">⭐</span>
                <span className="font-medium text-xs text-gray-700">NABL Accredited</span>
              </div>
            </div>
          </div>

          {/* Right Side Stats - Integrated */}
          <div className="w-full max-w-sm lg:w-80">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100/50 p-5 md:p-6">
              <h3 className="text-base font-bold mb-4 text-center text-gray-800">
                Trusted by Millions
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                   <div className="text-2xl font-bold text-blue-600 mr-3 min-w-[3ch]">950+</div>
                   <div className="text-xs text-gray-600 font-medium">Scan Centers</div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                   <div className="text-2xl font-bold text-green-600 mr-3 min-w-[3ch]">250k</div>
                   <div className="text-xs text-gray-600 font-medium">Tests Done</div>
                </div>
                 <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                   <div className="text-2xl font-bold text-purple-600 mr-3 min-w-[3ch]">35+</div>
                   <div className="text-xs text-gray-600 font-medium">Cities</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;