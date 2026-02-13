'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import { FiSearch, FiMapPin, FiCalendar } from 'react-icons/fi';
import { ALL_SERVICES_DATA } from '@/lib/data/services';
import GridScan from '@/components/effects/GridScan';

const HeroSection = () => {
  const router = useRouter();
  const [location, setLocation] = useState('Mumbai');
  const [service, setService] = useState('mri'); // Default to a valid ID

  const services = [
    ...ALL_SERVICES_DATA.radiology.items.map(s => ({ id: s.id, name: s.name })),
    ...ALL_SERVICES_DATA.pathology.items.map(s => ({ id: s.id, name: s.name })),
  ];

  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune'];

  const handleSearch = () => {
    // Redirect to booking page with selected service and location
    router.push(`/booking?service=${service}&city=${location}`);
  };

  return (
    <section className="relative pt-30 pb-10 md:pb-16 overflow-hidden">
      {/* 🔥 GridScan Background */}
      <div className="absolute inset-0">
        <GridScan
          sensitivity={0.4}
          lineThickness={1}
          linesColor="#2e2a40"
          gridScale={0.12}
          scanColor="#60a5fa"
          scanOpacity={0.35}
          enablePost={false}
          bloomIntensity={0.25}
          chromaticAberration={0}
          noiseIntensity={0.004}
        />
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10">
        <div className="container-custom px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

            {/* Left */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Book Medical Scans <br className="hidden md:block" />
                & Tests
                <span className="text-primary block mt-2">
                  With Instant Appointment
                </span>
              </h1>

              <p className="text-base md:text-lg text-white/90 mb-10 max-w-xl mx-auto lg:mx-0">
                India&apos;s largest network of diagnostic labs. 950+ scan centers,
                same-day reports, and home sample collection available.
              </p>

              {/* Search Box */}
              <div className="bg-card rounded-xl border border-border p-4 mb-10 w-full max-w-3xl mx-auto lg:mx-0 shadow-sm">
                <div className="flex flex-col md:flex-row gap-3">

                  {/* Location */}
                  <div className="relative md:w-1/4">
                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <select
                      className="w-full pl-9 pr-2 py-3 bg-background border border-border rounded-lg text-sm"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Service */}
                  <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <select
                      className="w-full pl-9 pr-2 py-3 bg-background border border-border rounded-lg text-sm"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                    >
                      {services.map(srv => (
                        <option key={srv.id} value={srv.id}>{srv.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Button */}
                  <Button
                    onClick={handleSearch}
                    className="py-3 px-8 text-sm w-full md:w-auto font-semibold"
                  >
                    <FiCalendar className="mr-2 w-4 h-4 inline" />
                    Book Now
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {['Same Day Reports', 'Home Service', 'NABL Accredited'].map(item => (
                  <div
                    key={item}
                    className="bg-secondary/50 border border-border rounded-full px-4 py-1.5"
                  >
                    <span className="text-xs font-medium text-foreground">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Stats */}
            <div className="w-full max-w-sm lg:w-80">
              <div className="bg-card rounded-xl border border-border p-6 md:p-8">
                <h3 className="text-base font-bold mb-6 text-center">
                  Trusted by Millions
                </h3>

                <div className="grid gap-4">
                  {[
                    ['950+', 'Scan Centers'],
                    ['250k', 'Tests Done'],
                    ['35+', 'Cities'],
                  ].map(([num, label]) => (
                    <div
                      key={label}
                      className="flex items-center p-4 bg-secondary/30 rounded-lg border"
                    >
                      <div className="text-2xl font-bold text-primary mr-4">
                        {num}
                      </div>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">
                        {label}
                      </div>
                    </div>
                  ))}
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