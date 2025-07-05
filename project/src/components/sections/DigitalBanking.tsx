'use client';

import { 
  Smartphone, 
  CreditCard, 
  Shield, 
  Zap, 
  Globe, 
  Users,
  ArrowRight,
  CheckCircle,
  Play
} from 'lucide-react';

const digitalServices = [
  {
    icon: Smartphone,
    title: "Mobile Banking",
    description: "Complete banking on your smartphone with our award-winning mobile app",
    features: ["Account management", "Fund transfers", "Bill payments", "Investment tracking"],
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Globe,
    title: "Internet Banking",
    description: "Secure online banking platform accessible from anywhere, anytime",
    features: ["Transaction history", "Statement downloads", "Loan applications", "Tax payments"],
    color: "from-green-500 to-green-600"
  },
  {
    icon: CreditCard,
    title: "Digital Payments",
    description: "Seamless payment solutions for all your financial transactions",
    features: ["UPI payments", "QR code scanning", "Contactless payments", "Merchant solutions"],
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Shield,
    title: "Cyber Security",
    description: "Advanced security measures to protect your financial information",
    features: ["Two-factor authentication", "Biometric login", "Fraud detection", "Secure encryption"],
    color: "from-red-500 to-red-600"
  }
];

const stats = [
  { number: "10M+", label: "Active Users", icon: Users },
  { number: "99.9%", label: "Uptime", icon: Zap },
  { number: "24/7", label: "Support", icon: Shield },
  { number: "150+", label: "Countries", icon: Globe }
];

export default function DigitalBanking() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Digital Banking Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of banking with our comprehensive digital platform designed for modern financial needs
          </p>
        </div>

        {/* Digital Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {digitalServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start space-x-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {service.description}
                    </p>
                    
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-semibold group-hover:translate-x-2 transition-all">
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-12 text-white mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Trusted by Millions</h3>
            <p className="text-xl opacity-90">
              Join the digital banking revolution with India's most trusted bank
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Demo Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              See Digital Banking in Action
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Watch how easy it is to manage your finances with our intuitive digital banking platform. 
              From simple transfers to complex investment management, everything is just a tap away.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Instant account access</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Real-time notifications</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Advanced security features</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">24/7 customer support</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>Get Started Today</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-orange-50 transition-all flex items-center justify-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative z-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-8">
              <img
                src="https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                alt="Digital Banking Demo"
                className="w-full h-64 object-cover rounded-xl shadow-lg"
              />
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Online</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                <div className="text-sm text-gray-600">Last transaction</div>
                <div className="font-semibold text-gray-900">₹2,500 transferred</div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-red-200 rounded-2xl transform rotate-3 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}