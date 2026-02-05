import HeroSection from '@/components/sections/HeroSection';
import StatsSection from '@/components/sections/StatsSection';
import ServicesGrid from '@/components/sections/ServicesGrid';
import FeaturesSection from '@/components/sections/FeaturesSection';
import Testimonials from '@/components/sections/Testimonials';
import FAQSection from '@/components/sections/FAQSection';
import Button from '@/components/ui/Button';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesGrid />
      <FeaturesSection />
      <Testimonials />
      <FAQSection />
      
      {/* Final CTA - Fixed responsive issues */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container-custom px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            Looking for something specific?
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-blue-100 mb-8 md:mb-10 max-w-2xl mx-auto px-2 md:px-0">
            Book any medical test, scan, or health package with our expert guidance
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 md:gap-6">
            <Button 
              href="/booking" 
              variant="secondary"
              size="lg"
              className="bg-white text-blue-700  hover:bg-blue-50 no-underline text-sm md:text-base  sm:w-auto px-4 py-3 md:px-6 md:py-4"
            >
              Book an MRI Scan
            </Button>
            <Button 
              href="/services" 
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white/10 no-underline text-sm md:text-base  sm:w-auto px-4 py-3 md:px-6 md:py-4"
            >
              View All Services
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}