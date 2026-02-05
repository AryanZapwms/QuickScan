import { 
  FiCheckCircle, 
  FiClock, 
  FiSmartphone, 
  FiTruck,
  FiShield,
  FiDollarSign 
} from 'react-icons/fi';

const FeaturesSection = () => {
  const features = [
    {
      icon: <FiCheckCircle className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />,
      title: 'Accurate Reports',
      description: 'Certified by expert radiologists and pathologists',
      color: 'text-green-600'
    },
    {
      icon: <FiClock className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />,
      title: 'Same Day Reports',
      description: 'Get reports within 4-6 hours for urgent tests',
      color: 'text-blue-600'
    },
    {
      icon: <FiSmartphone className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />,
      title: 'Smart Health Reports',
      description: 'Digital reports on app with lifetime access',
      color: 'text-purple-600'
    },
    {
      icon: <FiTruck className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />,
      title: 'Home Delivery (Portable Test)',
      description: 'Sample collection from home in 60 minutes',
      color: 'text-orange-600'
    },
    {
      icon: <FiShield className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />,
      title: 'Widest Test Menu',
      description: '1500+ tests including advanced diagnostics',
      color: 'text-red-600'
    },
    {
      icon: <FiDollarSign className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />,
      title: 'Best Price Guarantee',
      description: 'Lowest prices with quality assured',
      color: 'text-yellow-600'
    }
  ];

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container-custom px-4 md:px-6">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">
            Why Choose QuickScan?
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto">
            We combine cutting-edge technology with expert healthcare professionals 
            to deliver the best diagnostic experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-4 md:p-5 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition duration-300 group"
            >
              <div className={`${feature.color} mb-3 group-hover:scale-110 transition duration-300 inline-block`}>
                {feature.icon}
              </div>
              <h3 className="text-base md:text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
        
        {/* CTA Banner */}
        <div className="mt-8 md:mt-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg md:rounded-xl p-6 md:p-8 text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="lg:flex-1 text-center lg:text-left">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2">
                Portable Test Available
              </h3>
              <p className="text-blue-100 text-sm md:text-base">
                Book home sample collection. Available in 60+ cities across India.
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <button className="bg-white border-0 text-blue-600 hover:bg-blue-700 hover:bg-opacity-90 hover:text-white hover:border hover:border-white font-bold py-2.5 px-6 rounded-lg text-sm md:text-base transition duration-300 w-full sm:w-auto">
                Book Home Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;