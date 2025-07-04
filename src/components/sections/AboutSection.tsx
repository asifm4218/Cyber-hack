'use client';

import { 
  Award, 
  Users, 
  Building2, 
  Globe, 
  TrendingUp, 
  Shield,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const achievements = [
  {
    icon: Award,
    title: "85+ Years of Excellence",
    description: "Serving customers since 1906 with unwavering commitment to financial excellence"
  },
  {
    icon: Users,
    title: "10 Crore+ Customers",
    description: "Trusted by millions of customers across India and globally"
  },
  {
    icon: Building2,
    title: "10,000+ Branches",
    description: "Extensive network ensuring banking services reach every corner of India"
  },
  {
    icon: Globe,
    title: "Global Presence",
    description: "International banking services across 150+ countries worldwide"
  }
];

const values = [
  {
    title: "Customer First",
    description: "Every decision we make puts our customers' needs at the center",
    color: "from-blue-500 to-blue-600"
  },
  {
    title: "Innovation",
    description: "Continuously evolving with cutting-edge banking technology",
    color: "from-green-500 to-green-600"
  },
  {
    title: "Trust & Security",
    description: "Maintaining the highest standards of security and transparency",
    color: "from-purple-500 to-purple-600"
  },
  {
    title: "Social Responsibility",
    description: "Contributing to society through sustainable banking practices",
    color: "from-orange-500 to-orange-600"
  }
];

export default function AboutSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            About Canara Bank
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A legacy of trust, innovation, and excellence in banking services for over eight decades
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Content */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Building India's Financial Future
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Since 1906, Canara Bank has been at the forefront of India's banking revolution. 
              From our humble beginnings in Mangalore to becoming one of India's largest public sector banks, 
              we have consistently delivered innovative financial solutions that empower individuals and businesses.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Today, we serve over 10 crore customers through our extensive network of branches, ATMs, 
              and digital platforms, making banking accessible to every Indian, everywhere.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Nationalized bank with government backing</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">ISO certified banking processes</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Award-winning customer service</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Sustainable banking practices</span>
              </div>
            </div>
            
            <button className="bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-700 transition-all transform hover:scale-105 flex items-center space-x-2">
              <span>Learn More About Us</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                alt="Canara Bank Heritage"
                className="w-full h-80 object-cover rounded-2xl shadow-xl"
              />
              
              {/* Overlay Stats */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-orange-600">₹15L Cr+</div>
                    <div className="text-sm text-gray-600">Total Business</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">AAA</div>
                    <div className="text-sm text-gray-600">Credit Rating</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-red-200 rounded-2xl transform -rotate-3 -z-10"></div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                  {achievement.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {achievement.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h3>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl border border-gray-200 hover:border-orange-200 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${value.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                  {value.title}
                </h4>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Join the Canara Bank Family</h3>
            <p className="text-xl mb-8 opacity-90">
              Experience banking excellence with India's most trusted financial partner
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
                Open Account Now
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-all">
                Visit Nearest Branch
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}