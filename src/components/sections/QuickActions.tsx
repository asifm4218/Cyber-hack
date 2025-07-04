'use client';

import { 
  CreditCard, 
  Smartphone, 
  Calculator, 
  MapPin, 
  FileText, 
  DollarSign,
  ArrowRight,
  Clock
} from 'lucide-react';

const quickActions = [
  {
    icon: CreditCard,
    title: "Apply for Credit Card",
    description: "Get instant approval",
    color: "from-canara-blue-500 to-canara-blue-600",
    href: "#"
  },
  {
    icon: Smartphone,
    title: "Mobile Banking",
    description: "Download our app",
    color: "from-canara-yellow-500 to-canara-orange-500",
    href: "#"
  },
  {
    icon: Calculator,
    title: "EMI Calculator",
    description: "Calculate your EMI",
    color: "from-purple-500 to-purple-600",
    href: "#"
  },
  {
    icon: MapPin,
    title: "Find Branch/ATM",
    description: "Locate nearest branch",
    color: "from-green-500 to-green-600",
    href: "#"
  },
  {
    icon: FileText,
    title: "Apply for Loan",
    description: "Quick loan approval",
    color: "from-red-500 to-red-600",
    href: "#"
  },
  {
    icon: DollarSign,
    title: "Fixed Deposits",
    description: "High interest rates",
    color: "from-teal-500 to-teal-600",
    href: "#"
  }
];

export default function QuickActions() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Access our most popular services with just a few clicks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={index}
                className="group bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${action.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-canara-blue-600 dark:group-hover:text-canara-blue-400 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gray-50 dark:bg-gray-600 hover:bg-canara-blue-50 dark:hover:bg-canara-blue-900/20 text-gray-700 dark:text-gray-300 hover:text-canara-blue-600 dark:hover:text-canara-blue-400 py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 group-hover:bg-canara-blue-600 group-hover:text-white dark:group-hover:bg-canara-blue-600">
                    <span className="font-medium">Get Started</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Quick Links */}
        <div className="mt-12 bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Banking Hours & Support</h3>
            <Clock className="w-6 h-6 text-canara-blue-600 dark:text-canara-blue-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-canara-blue-50 dark:bg-canara-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Branch Hours</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mon-Fri: 10:00 AM - 4:00 PM</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sat: 10:00 AM - 2:00 PM</p>
            </div>
            
            <div className="text-center p-4 bg-canara-yellow-50 dark:bg-canara-yellow-900/20 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Customer Care</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">24/7 Support Available</p>
              <p className="text-sm text-canara-blue-600 dark:text-canara-blue-400 font-medium">1800-425-0018</p>
            </div>
            
            <div className="text-center p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Digital Banking</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Available 24/7</p>
              <p className="text-sm text-success-600 dark:text-success-400 font-medium">Always Online</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}