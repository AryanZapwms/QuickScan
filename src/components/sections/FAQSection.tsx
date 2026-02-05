'use client';

import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'MRI Scan in Mumbai - an important diagnostic step towards important health?',
      answer: 'MRI Scan is a crucial diagnostic tool that provides detailed images of organs and tissues. In Mumbai, we offer advanced 1.5T and 3T MRI scans with expert radiologists for accurate diagnosis.'
    },
    {
      question: 'Considering for same best "MRI Scan near me"?',
      answer: 'We have 50+ MRI scan centers across Mumbai. Use our location finder to find the nearest center with available slots, or book our portable MRI service for home visits.'
    },
    {
      question: 'Understanding the MRI Scan cost in Mumbai?',
      answer: 'MRI Scan cost in Mumbai starts from ₹2500 for basic scans and goes up to ₹15000 for specialized scans. We offer transparent pricing with no hidden charges.'
    },
    {
      question: 'MRI Scan Price in Mumbai: Affordable and transparent?',
      answer: 'Yes, we provide complete price transparency. Our prices are 20-30% lower than hospital rates. You can compare prices for different centers on our platform.'
    },
    {
      question: 'Finding the best MRI Scan Centre in Mumbai?',
      answer: 'We partner with NABL accredited labs with advanced equipment. All our centers are rated by patients, so you can choose based on reviews and facilities.'
    },
    {
      question: 'Book your MRI Scan in Mumbai with QuickScan?',
      answer: 'Booking is simple: 1) Select test 2) Choose location 3) Pick time slot 4) Make payment 5) Get confirmation. You can book online or call 1800-123-4567.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container-custom px-4 md:px-6">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Got questions? We&apos;re here to help
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="mb-3 border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full text-left p-3 md:p-4 bg-gray-50 hover:bg-gray-100 transition duration-300 flex justify-between items-center gap-3"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-sm md:text-base pr-2 text-left">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <FiChevronUp className="text-blue-600 flex-shrink-0 w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <FiChevronDown className="text-gray-500 flex-shrink-0 w-4 h-4 md:w-5 md:h-5" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="p-3 md:p-4 bg-white">
                  <p className="text-gray-700 text-sm md:text-base">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4 text-sm">
            Still have questions? Contact our support team
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white border-0 font-semibold py-2.5 px-6 rounded-lg text-sm transition w-full sm:w-auto">
              Call Now: 1800-123-4567
            </button>
            <button className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-2.5 px-6 rounded-lg border border-blue-600 text-sm transition w-full sm:w-auto">
              WhatsApp Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;