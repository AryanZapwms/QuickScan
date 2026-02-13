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
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-50">
      <div className="w-full">
        {/* Main Navigation - Compact */}
        <nav className="flex h-16 items-center container-custom px-4">
          <div className="flex w-full justify-between items-center">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 no-underline group mr-6"
            >
              <div className="bg-primary p-1.5 rounded-lg">
                <MdLocalHospital className="text-primary-foreground text-xl" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-foreground leading-none tracking-tight">
                  QuickScan
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm font-medium">
              {navLinks.map((link) => {
                if (link.name === "Services") {
                  return (
                    <div
                      key={link.name}
                      className="relative group h-16 flex items-center"
                      onMouseEnter={() => setIsServicesOpen(true)}
                      onMouseLeave={() => setIsServicesOpen(false)}
                    >
                      <button
                        className={`font-medium transition-colors flex items-center bg-transparent border-0 cursor-pointer ${
                          pathname.startsWith("/services")
                            ? "text-primary"
                            : "text-muted-foreground hover:text-primary"
                        }`}
                      >
                        {link.name}
                        <FiChevronDown className={`ml-1 transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className={`absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-popover shadow-md rounded-xl border border-border overflow-hidden transition-all duration-200 transform origin-top ${isServicesOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}`}>
                        <div className="grid grid-cols-2 gap-0">
                          <div className="p-6 bg-secondary/30">
                            <h3 className="font-semibold text-foreground mb-4 flex items-center">
                              <span className="bg-background border border-border p-1.5 rounded-md mr-2 text-xs">🔬</span>
                              Pathology
                            </h3>
                            <ul className="space-y-2">
                              {ALL_SERVICES_DATA.pathology.items.slice(0, 6).map((item) => (
                                <li key={item.id}>
                                  <Link 
                                    href={`/services/${item.id}`}
                                    className="text-sm text-muted-foreground hover:text-primary block py-1 no-underline transition-colors"
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                              <li>
                                <Link href="/services?category=pathology" className="text-xs font-medium text-primary hover:underline mt-2 inline-block">
                                  View All Pathology →
                                </Link>
                              </li>
                            </ul>
                          </div>
                          <div className="p-6">
                            <h3 className="font-semibold text-foreground mb-4 flex items-center">
                              <span className="bg-secondary p-1.5 rounded-md mr-2 text-xs">🩻</span>
                              Radiology
                            </h3>
                            <ul className="space-y-2">
                              {ALL_SERVICES_DATA.radiology.items.slice(0, 6).map((item) => (
                                <li key={item.id}>
                                  <Link 
                                    href={`/services/${item.id}`}
                                    className="text-sm text-muted-foreground hover:text-primary block py-1 no-underline transition-colors"
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                              <li>
                                <Link href="/services?category=radiology" className="text-xs font-medium text-primary hover:underline mt-2 inline-block">
                                  View All Radiology →
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="bg-muted/50 px-6 py-3 border-t border-border text-center">
                          <Link href="/services" className="text-sm font-medium text-muted-foreground hover:text-primary no-underline">
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
                    className={`transition-colors hover:text-primary no-underline ${
                      pathname === link.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center space-x-4">
               {/* Urgent Booking Button */}
               <Link 
                  href="/booking?urgent=true"
                  className="hidden md:flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-2 rounded-lg font-medium transition-colors no-underline shadow-sm animate-pulse"
                >
                  <span className="text-lg">⚡</span>
                  <span>Urgent Booking</span>
                </Link>

                 <div className="flex items-center space-x-4">
              {status === "authenticated" ? (
                <>
                  <Link
                    href="/dashboard"
                    className="hidden md:flex items-center text-sm font-medium text-muted-foreground hover:text-primary no-underline transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hidden md:flex hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 text-muted-foreground items-center bg-transparent px-3 py-1.5 rounded-md border border-input font-medium text-xs"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden md:flex items-center text-sm font-medium text-muted-foreground hover:text-primary no-underline transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="hidden md:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 no-underline"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground bg-transparent border-0 hover:bg-accent rounded-md p-2 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            </div>
           
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-background border-b border-border p-4 shadow-lg animate-in slide-in-from-top-2 md:hidden">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => {
                  if (link.name === "Services") {
                    return (
                       <div key={link.name} className="space-y-2">
                          <button 
                            className="w-full flex justify-between items-center font-medium py-2 text-sm text-foreground hover:text-primary bg-transparent border-0"
                            onClick={() => setIsServicesOpen(!isServicesOpen)}
                          >
                            <span>Services</span>
                            <FiChevronDown className={`transition-transform ${isServicesOpen ? "rotate-180" : ""}`} />
                          </button>
                          
                          {isServicesOpen && (
                            <div className="pl-4 space-y-2 border-l border-border ml-2">
                              {ALL_SERVICES_DATA.pathology.items.slice(0, 3).map((item) => (
                                <Link 
                                  key={item.id}
                                  href={`/services/${item.id}`}
                                  className="block text-sm text-muted-foreground hover:text-primary py-1"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {item.name}
                                </Link>
                              ))}
                               <Link 
                                href="/services"
                                className="block text-sm font-medium text-primary py-1"
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
                      className={`font-medium py-2 text-sm transition-colors ${
                        pathname === link.href
                          ? "text-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  );
                })}

                {/* Mobile Urgent Booking */}
                <Link
                  href="/booking?urgent=true"
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors no-underline shadow-sm w-full justify-center mb-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">⚡</span>
                  <span>Urgent Booking</span>
                </Link>

                {/* Auth Links in Mobile */}
                <div className="pt-4 border-t border-border space-y-3">
                  {status === "authenticated" ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="flex items-center py-2 text-sm text-foreground hover:text-primary"
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
                        className="flex items-center text-destructive py-2 text-sm w-full bg-transparent border-0"
                      >
                        <FiLogOut className="mr-2 w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block py-2 text-sm text-center text-muted-foreground hover:text-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="block w-full py-2 bg-primary text-primary-foreground rounded-md text-center font-medium shadow-sm hover:bg-primary/90 transition-colors text-sm"
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
