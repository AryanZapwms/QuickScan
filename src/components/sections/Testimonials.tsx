'use client';

import { useState } from 'react';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      name: 'Arun Tiwari',
      location: 'Mumbai',
      rating: 5,
      comment: 'It\'s quick and easy booking, cheaper price, nice service, scan centre was nearby, quick service, professional scanning done.',
      image: 'AT'
    },
    {
      name: 'Nandni Tiwari',
      location: 'Delhi',
      rating: 5,
      comment: 'Very good service. The technician came on time for home sample collection. Reports were accurate and delivered quickly.',
      image: 'NT'
    },
    {
      name: 'Meenakshi Roy',
      location: 'Bangalore',
      rating: 4,
      comment: 'Excellent service. Price was reasonable compared to other labs. MRI scan was comfortable and report was detailed.',
      image: 'MR'
    },
    {
      name: 'Rohan Sharma',
      location: 'Chennai',
      rating: 5,
      comment: 'Best experience! From booking to report delivery, everything was seamless. Highly recommended for health checkups.',
      image: 'RS'
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-8 md:py-12 bg-gray-50">
      <div className="container-custom px-4 md:px-6">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Trusted by over 250,000+ patients across India
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-6 md:p-8">
            <div className="flex items-start mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-blue-600 text-lg font-bold">
                  {testimonials[currentIndex].image}
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 md:gap-2 mb-1">
                  <h3 className="text-base md:text-lg font-bold truncate">
                    {testimonials[currentIndex].name}
                  </h3>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        className={`w-3 h-3 md:w-4 md:h-4 ${
                          i < testimonials[currentIndex].rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm md:text-base">{testimonials[currentIndex].location}</p>
              </div>
            </div>
            
            <p className="text-gray-700 text-sm md:text-base italic mb-4 md:mb-6">
              &ldquo;{testimonials[currentIndex].comment}&rdquo;
            </p>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition ${
                      index === currentIndex ? 'bg-blue-600 scale-125' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-full border border-gray-300 hover:border-blue-600 hover:text-blue-600 transition"
                  aria-label="Previous testimonial"
                >
                  <FiChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-full border border-gray-300 hover:border-blue-600 hover:text-blue-600 transition"
                  aria-label="Next testimonial"
                >
                  <FiChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="mt-8 md:mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="text-center p-3 md:p-4 bg-white rounded-lg shadow-sm">
            <div className="text-xl md:text-2xl font-bold text-blue-600 mb-1">4.8/5</div>
            <div className="text-gray-600 text-xs md:text-sm">Customer Rating</div>
          </div>
          <div className="text-center p-3 md:p-4 bg-white rounded-lg shadow-sm">
            <div className="text-xl md:text-2xl font-bold text-green-600 mb-1">99%</div>
            <div className="text-gray-600 text-xs md:text-sm">Report Accuracy</div>
          </div>
          <div className="text-center p-3 md:p-4 bg-white rounded-lg shadow-sm">
            <div className="text-xl md:text-2xl font-bold text-purple-600 mb-1">98%</div>
            <div className="text-gray-600 text-xs md:text-sm">On-Time Delivery</div>
          </div>
          <div className="text-center p-3 md:p-4 bg-white rounded-lg shadow-sm">
            <div className="text-xl md:text-2xl font-bold text-orange-600 mb-1">24/7</div>
            <div className="text-gray-600 text-xs md:text-sm">Customer Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;