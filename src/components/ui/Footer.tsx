import Link from 'next/link';
import { 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin 
} from 'react-icons/fi';
import { MdLocalHospital } from 'react-icons/md';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Labs', href: '/labs' },
    { name: 'Contact', href: '/contact' },
  ];

  const services = [
    { name: 'MRI Scan', href: '/services/mri-scan' },
    { name: 'CT Scan', href: '/services/ct-scan' },
    { name: 'X-Ray', href: '/services/x-ray' },
    { name: 'Health Checkup', href: '/services/health-checkup' },
    { name: 'Blood Tests', href: '/services/blood-tests' },
  ];

  const legal = [
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Refund & Cancellation', href: '/refund' },
    { name: 'Disclaimer', href: '/disclaimer' },
  ];

  return (
    <footer className="bg-background border-t border-border pt-16 md:pt-20 pb-8 md:pb-12 text-sm">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          
          {/* Company Info */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <MdLocalHospital className="text-primary text-2xl" />
              <span className="font-bold text-lg">QuickScan</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              India&apos;s leading diagnostic service provider with 950+ scan centers. 
              Book medical tests, scans, and health checkups with instant appointments.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-primary transition-colors block py-1 no-underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link 
                    href={service.href} 
                    className="text-muted-foreground hover:text-primary transition-colors block py-1 no-underline"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FiMapPin className="text-primary mt-1 flex-shrink-0 w-4 h-4" />
                <p className="text-muted-foreground">
                  QuickScan Diagnostics Pvt. Ltd.<br />
                  123 Medical Street, Mumbai<br />
                  Maharashtra - 400001
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <FiPhone className="text-primary flex-shrink-0 w-4 h-4" />
                <p className="text-muted-foreground">1800-123-4567</p>
              </div>
              <div className="flex items-center space-x-3">
                <FiMail className="text-primary flex-shrink-0 w-4 h-4" />
                <p className="text-muted-foreground">info@quickscan.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} QuickScan Diagnostics. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {legal.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;  