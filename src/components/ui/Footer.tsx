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
    <footer className="bg-gray-900 text-white  ">
      <div className="container-custom px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          
          {/* Company Info */}
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <MdLocalHospital className="text-2xl md:text-3xl text-blue-400" />
              <h2 className="text-xl md:text-2xl font-bold">QuickScan</h2>
            </div>
            <p className="text-gray-400 mb-6 text-sm md:text-base">
              India&apos;s leading diagnostic service provider with 950+ scan centers. 
              Book medical tests, scans, and health checkups with instant appointments.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Facebook">
                <FiFacebook className="w-5 h-5 md:w-6 md:h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Twitter">
                <FiTwitter className="w-5 h-5 md:w-6 md:h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Instagram">
                <FiInstagram className="w-5 h-5 md:w-6 md:h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="LinkedIn">
                <FiLinkedin className="w-5 h-5 md:w-6 md:h-6" />
              </a>
            </div>
          </div>

    <div className="flex gap-5 justify-center ">

          {/* Quick Links */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Quick Links</h3>
            <ul className="space-y-2 md:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white no-underline transition duration-300 text-sm md:text-base block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Our Services</h3>
            <ul className="space-y-2 md:space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link 
                    href={service.href} 
                    className="text-gray-400 hover:text-white no-underline transition duration-300 text-sm md:text-base block py-1"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

              </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Contact Us</h3>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start space-x-2 md:space-x-3">
                <FiMapPin className="text-blue-400 mt-0.5 md:mt-1 flex-shrink-0 w-4 h-4 md:w-5 md:h-5" />
                <p className="text-gray-400 text-sm md:text-base">
                  QuickScan Diagnostics Pvt. Ltd.<br />
                  123 Medical Street, Mumbai<br />
                  Maharashtra - 400001
                </p>
              </div>
              <div className="flex items-center space-x-2 md:space-x-3">
                <FiPhone className="text-blue-400 flex-shrink-0 w-4 h-4 md:w-5 md:h-5" />
                <p className="text-gray-400 text-sm md:text-base">1800-123-4567</p>
              </div>
              <div className="flex items-center space-x-2 md:space-x-3">
                <FiMail className="text-blue-400 flex-shrink-0 w-4 h-4 md:w-5 md:h-5" />
                <p className="text-gray-400 text-sm md:text-base">info@quickscan.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-xs md:text-sm mb-4 md:mb-0 text-center md:text-left">
              © {new Date().getFullYear()} QuickScan Diagnostics. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-6">
              {legal.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className="text-gray-400 hover:text-white text-xs md:text-sm transition whitespace-nowrap"
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