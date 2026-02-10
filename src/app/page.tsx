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
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Prioritize Your Health?
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-10">
            Book your appointment today and experience the QuickScan difference.
            Fast, accurate, and caring service awaits.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/book">
              <Button
                variant="secondary"
                size="lg"
                 className="w-full sm:w-auto text-lg px-8 py-6 text-font-semibold border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground text-black"
              >
                Book an Appointment Now
              </Button>
            </a>
            <a href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto  text-lg px-8 py-6 text-font-semibold border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground text-black"
              >
                Contact Support
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}