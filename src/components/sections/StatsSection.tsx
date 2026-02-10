import { FiCheckCircle, FiClock, FiHome, FiUsers } from 'react-icons/fi';
import { MdLocalHospital } from 'react-icons/md';

const StatsSection = () => {
  const stats = [
    {
      icon: <MdLocalHospital className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />,
      value: '950+',
      label: 'Scan Centers & Labs',
      description: 'Across India'
    },
    {
      icon: <FiUsers className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />,
      value: '250,000+',
      label: 'Tests Completed',
      description: 'Trusted by thousands'
    },
    {
      icon: <FiCheckCircle className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />,
      value: '98.5%',
      label: 'Accuracy Rate',
      description: 'Certified reports'
    },
    {
      icon: <FiClock className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />,
      value: '4-6',
      label: 'Hours Average',
      description: 'For report delivery'
    },
    {
      icon: <FiHome className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />,
      value: '24/7',
      label: 'Home Service',
      description: 'Available in metro cities'
    }
  ];

  return (
    <section className="py-6 md:py-8 border-b border-border bg-background">
      <div className="container-custom px-4 md:px-6">
        <h2 className="text-lg md:text-xl font-bold text-center mb-6 text-foreground">
          Why Choose QuickScan?
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center p-4 rounded-xl border border-transparent hover:border-border hover:bg-secondary/30 transition-all duration-300"
            >
              <div className="text-primary mb-3 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-xl md:text-2xl font-bold text-foreground leading-none mb-2">
                {stat.value}
              </div>
              <div className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;