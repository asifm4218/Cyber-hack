'use client';

import { 
  CreditCard, 
  Smartphone, 
  Shield, 
  Zap, 
  Gift, 
  Star,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const products = [
  {
    name: "Canara Premium Credit Card",
    type: "Credit Card",
    image: "https://images.pexels.com/photos/164501/pexels-photo-164501.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
    features: [
      "5% cashback on all purchases",
      "Complimentary airport lounge access",
      "Zero annual fee for first year",
      "Reward points never expire"
    ],
    highlight: "Most Popular",
    color: "from-purple-500 to-purple-600"
  },
  {
    name: "Canara Mobile Banking",
    type: "Digital Banking",
    image: "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
    features: [
      "Instant money transfers",
      "Bill payments & recharges",
      "Investment management",
      "24/7 customer support"
    ],
    highlight: "New Features",
    color: "from-blue-500 to-blue-600"
  },
  {
    name: "Canara Secure Savings",
    type: "Savings Account",
    image: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
    features: [
      "High interest rates up to 7%",
      "Zero minimum balance",
      "Free debit card & checkbook",
      "Insurance coverage included"
    ],
    highlight: "Best Rates",
    color: "from-green-500 to-green-600"
  }
];

const digitalFeatures = [
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Complete banking on your smartphone"
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Advanced encryption and fraud protection"
  },
  {
    icon: Zap,
    title: "Instant Transactions",
    description: "Real-time money transfers and payments"
  },
  {
    icon: Gift,
    title: "Exclusive Rewards",
    description: "Earn points and cashback on every transaction"
  }
];

export default function Products() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our innovative banking products designed to simplify your financial journey
          </p>
        </div>

        {/* Featured Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {products.map((product, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                {/* Highlight Badge */}
                <div className={`absolute top-4 left-4 bg-gradient-to-r ${product.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                  {product.highlight}
                </div>
                
                {/* Product Type */}
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm opacity-80">{product.type}</p>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  {product.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full bg-gradient-to-r ${product.color} text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2`}>
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Digital Banking Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Digital Banking?
            </h3>
            <p className="text-lg text-gray-600">
              Experience the future of banking with our cutting-edge digital solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {digitalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* App Download Section */}
          <div className="mt-12 text-center">
            <h4 className="text-2xl font-bold text-gray-900 mb-6">
              Download Our Mobile App
            </h4>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                  <span className="text-black font-bold text-xs">📱</span>
                </div>
                <div className="text-left">
                  <p className="text-xs">Download on the</p>
                  <p className="font-semibold">App Store</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                  <span className="text-black font-bold text-xs">▶️</span>
                </div>
                <div className="text-left">
                  <p className="text-xs">Get it on</p>
                  <p className="font-semibold">Google Play</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>4.8 Rating</span>
              </div>
              <div>1M+ Downloads</div>
              <div>Available in 12 Languages</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}