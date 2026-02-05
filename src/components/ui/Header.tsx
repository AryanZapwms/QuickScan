"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  FiMenu,
  FiX,
  FiUser,
  FiPhone,
  FiMapPin,
  FiLogOut,
} from "react-icons/fi";
import { MdLocalHospital } from "react-icons/md";

import { FiChevronDown } from "react-icons/fi";
import { ALL_SERVICES_DATA } from "@/lib/data/services";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm z-50 transition-all duration-300">
      <div className="w-full">
        {/* Top Bar - Compact & Modern */}
        <div className="bg-black text-white py-1 px-4 w-full text-[11px] md:text-xs">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 md:space-x-6 ml-2 md:ml-10">
              <div className="flex items-center">
                <FiPhone className="mr-1.5 w-3 h-3" />
                <span className="font-medium">1800-123-4567</span>
              </div>
              <div className="hidden md:flex items-center">
                <FiMapPin className="mr-1.5 w-3 h-3" />
                <span className="text-gray-300">950+ Scan Centers</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {status === "authenticated" ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center hover:text-blue-200 text-white no-underline transition-colors"
                  >
                    <FiUser className="mr-1 w-3 h-3" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hover:bg-red-500 hover:text-white transition-all duration-200 text-red-500 flex items-center bg-white px-3 py-0.5 rounded-full border-0 font-medium text-[10px] md:text-xs mr-2 md:mr-6"
                  >
                    <FiLogOut className="mr-1 w-3 h-3" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center hover:text-blue-200 text-white no-underline transition-colors"
                  >
                    <FiUser className="mr-1 w-3 h-3" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/register"
                    className="bg-white text-black px-3 py-0.5 rounded text-[10px] md:text-xs font-bold hover:bg-blue-50 transition-colors mr-2 md:mr-6 no-underline"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Navigation - Compact */}
        <nav className="py-2.5 md:py-3 px-3 md:px-4 container-custom">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 no-underline group"
            >
              <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
                <MdLocalHospital className="text-white text-xl md:text-2xl" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-none tracking-tight group-hover:text-blue-700 transition-colors">
                  QuickScan
                </h1>
                <span className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                  Medical Diagnostics
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navLinks.map((link) => {
                if (link.name === "Services") {
                  return (
                    <div
                      key={link.name}
                      className="relative group"
                      onMouseEnter={() => setIsServicesOpen(true)}
                      onMouseLeave={() => setIsServicesOpen(false)}
                    >
                      <button
                        className={`font-medium transition-all duration-200 flex items-center bg-transparent border-0 cursor-pointer ${
                          pathname.startsWith("/services")
                            ? "text-blue-600 font-semibold"
                            : "text-gray-600 hover:text-blue-600"
                        }`}
                      >
                        {link.name}
                        <FiChevronDown className={`ml-1 transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className={`absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden transition-all duration-200 transform origin-top ${isServicesOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}`}>
                        <div className="grid grid-cols-2 gap-0">
                          <div className="p-6 bg-blue-50/50">
                            <h3 className="font-bold text-blue-800 mb-4 flex items-center">
                              <span className="bg-blue-100 p-1.5 rounded-lg mr-2">🔬</span>
                              Pathology
                            </h3>
                            <ul className="space-y-2">
                              {ALL_SERVICES_DATA.pathology.items.slice(0, 6).map((item) => (
                                <li key={item.id}>
                                  <Link 
                                    href={`/services/${item.id}`}
                                    className="text-sm text-gray-600 hover:text-blue-600 block py-1 no-underline hover:translate-x-1 transition-transform"
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                              <li>
                                <Link href="/services?category=pathology" className="text-xs font-bold text-blue-600 hover:underline mt-2 inline-block">
                                  View All Pathology →
                                </Link>
                              </li>
                            </ul>
                          </div>
                          <div className="p-6 bg-cyan-50/50">
                            <h3 className="font-bold text-cyan-800 mb-4 flex items-center">
                              <span className="bg-cyan-100 p-1.5 rounded-lg mr-2">🩻</span>
                              Radiology
                            </h3>
                            <ul className="space-y-2">
                              {ALL_SERVICES_DATA.radiology.items.slice(0, 6).map((item) => (
                                <li key={item.id}>
                                  <Link 
                                    href={`/services/${item.id}`}
                                    className="text-sm text-gray-600 hover:text-cyan-600 block py-1 no-underline hover:translate-x-1 transition-transform"
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                              <li>
                                <Link href="/services?category=radiology" className="text-xs font-bold text-cyan-600 hover:underline mt-2 inline-block">
                                  View All Radiology →
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-center">
                          <Link href="/services" className="text-sm font-medium text-gray-600 hover:text-blue-600 no-underline">
                            View All Services
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`font-medium transition-all duration-200 no-underline text-sm hover:-translate-y-0.5 ${
                      pathname === link.href
                        ? "text-blue-600 font-semibold"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 bg-transparent border-0 hover:bg-gray-100 rounded-full p-2 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-2 pb-4 border-t border-gray-100 animate-fadeInUp max-h-[80vh] overflow-y-auto">
              <div className="flex flex-col space-y-2 mt-3">
                {navLinks.map((link) => {
                  if (link.name === "Services") {
                    return (
                       <div key={link.name} className="space-y-2">
                          <button 
                            className="w-full flex justify-between items-center font-medium py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 bg-transparent border-0"
                            onClick={() => setIsServicesOpen(!isServicesOpen)}
                          >
                            <span>Services</span>
                            <FiChevronDown className={`transition-transform ${isServicesOpen ? "rotate-180" : ""}`} />
                          </button>
                          
                          {isServicesOpen && (
                            <div className="pl-4 space-y-4 border-l-2 border-gray-100 ml-4">
                              <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pathology</h4>
                                <ul className="space-y-2">
                                  {ALL_SERVICES_DATA.pathology.items.slice(0, 4).map((item) => (
                                    <li key={item.id}>
                                      <Link 
                                        href={`/services/${item.id}`}
                                        className="text-sm text-gray-600 block py-1"
                                        onClick={() => setIsMenuOpen(false)}
                                      >
                                        {item.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Radiology</h4>
                                <ul className="space-y-2">
                                  {ALL_SERVICES_DATA.radiology.items.slice(0, 4).map((item) => (
                                    <li key={item.id}>
                                      <Link 
                                        href={`/services/${item.id}`}
                                        className="text-sm text-gray-600 block py-1"
                                        onClick={() => setIsMenuOpen(false)}
                                      >
                                        {item.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <Link 
                                href="/services"
                                className="block text-sm font-bold text-blue-600 py-2"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                View All Services →
                              </Link>
                            </div>
                          )}
                       </div>
                    );
                  }
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`font-medium py-2 px-3 rounded-lg text-sm transition-colors ${
                        pathname === link.href
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  );
                })}

                {/* Auth Links in Mobile */}
                <div className="pt-3 border-t border-gray-100 space-y-3 px-1">
                  {status === "authenticated" ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="flex items-center py-2 text-sm text-gray-700 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiUser className="mr-2 w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center text-red-600 py-2 text-sm w-full hover:bg-red-50 rounded-lg px-2 bg-transparent border-0"
                      >
                        <FiLogOut className="mr-2 w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block py-2 text-sm text-center text-gray-600 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="block w-full py-2.5 bg-blue-600 text-white rounded-lg text-center font-medium shadow-sm hover:bg-blue-700 transition-colors text-sm"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Labs", href: "/labs" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default Header;
