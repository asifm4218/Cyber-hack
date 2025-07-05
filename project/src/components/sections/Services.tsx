'use client';

import { 
  Banknote, 
  CreditCard, 
  Home, 
  Car, 
  Briefcase, 
  Shield,
  TrendingUp,
  Globe,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const services = [
  {
    category: "Personal Banking",
    icon: Banknote,
    color: "from-blue-500 to-blue-600",
    services: [
      { name: "Savings Account", features: ["Zero balance", "High interest", "Free debit card"] },
      { name: "Current Account", features: ["Business banking", "Overdraft facility", "Bulk transactions"] },
      { name: "Fixed Deposits", features: ["Competitive rates", "Flexible tenure", "Auto-renewal"] },
      { name: "Recurring Deposits", features: ["Systematic savings", "Loan against RD", "Flexible amounts"] }
    ]
  },
  {
    category: "Loans & Credit",
    icon: CreditCard,
    color: "from-green-500 to-green-600",
    services: [
      { name: "Home Loans", features: ["Low interest rates", "Quick approval", "Flexible repayment"] },
      { name: "Personal Loans", features: ["Instant approval", "No collateral", "Competitive rates"] },
      { name: "Car Loans", features: ["100% financing", "Quick processing", "Attractive rates"] },
      { name: "Credit Cards", features: ["Reward points", "Cashback offers", "Global acceptance"] }
    ]
  },
  {
    category: "Investment & Insurance",
    icon: TrendingUp,
    color: "from-purple-500 to-purple-600",
    services: [
      { name: "Mutual Funds", features: ["Expert management", "Diversified portfolio", "SIP options"] },
      { name: "Life Insurance", features: ["Comprehensive coverage", "Tax benefits", "Flexible premiums"] },
      { name: "General Insurance", features: ["Vehicle insurance", "Health insurance", "Property insurance"] },
      { name: "Demat Account", features: ["Online trading", "Low brokerage", "Research reports"] }
    ]
  },
  {
    category: "Corporate Banking",
    icon: Briefcase,
    color: "from-orange-500 to-orange-600",
    services: [
      { name: "Cash Management", features: ["Collection services", "Payment solutions", "Liquidity management"] },
      { name: "Trade Finance", features: ["Letter of credit", "Bank guarantee", "Export financing"] },
      { name: "Working Capital", features: ["Overdraft facility", "Bill discounting", "Inventory financing"] },
      { name: "Term Loans", features: ["Project financing", "Equipment loans", "Expansion capital"] }
    ]
  }
];

export default function Services() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Our Banking Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive financial solutions designed to meet all your banking needs with excellence and trust
          </p>
        </div>

        <div className="space-y-16">
          {services.map((category, categoryIndex) => {
            const CategoryIcon = category.icon;
            return (
              <div key={categoryIndex} className="relative">
                {/* Category Header */}
                <div className="flex items-center justify-center mb-12">
                  <div className="flex items-center space-x-4 bg-gray-50 px-8 py-4 rounded-full">
                    <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center`}>
                      <CategoryIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{category.category}</h3>
                  </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {category.services.map((service, serviceIndex) => (
                    <div
                      key={serviceIndex}
                      className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:border-orange-200"
                    >
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                          {service.name}
                        </h4>
                        <ul className="space-y-2">
                          {service.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <button className="w-full bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-600 py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 group-hover:bg-orange-600 group-hover:text-white">
                        <span className="font-medium">Learn More</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-xl mb-8 opacity-90">
              Join millions of satisfied customers and experience banking excellence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
                Open Account Today
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-all">
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}