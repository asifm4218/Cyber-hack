'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, ArrowRight, Shield, Award, Users } from 'lucide-react';

const heroSlides = [
  {
    id: 1,
    title: "Digital Banking Made Simple",
    subtitle: "Experience seamless banking with our advanced digital solutions",
    description: "Access your accounts, transfer money, pay bills, and manage investments - all from your smartphone or computer.",
    image: "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",
    cta: "Explore Digital Banking",
    color: "from-canara-blue-600 to-canara-blue-800"
  },
  {
    id: 2,
    title: "Home Loans at Attractive Rates",
    subtitle: "Turn your dream home into reality",
    description: "Get home loans starting from 8.5% with minimal documentation and quick approval process.",
    image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",
    cta: "Apply for Home Loan",
    color: "from-canara-blue-700 to-canara-blue-900"
  },
  {
    id: 3,
    title: "Secure Your Future",
    subtitle: "Comprehensive insurance and investment solutions",
    description: "Protect your family and grow your wealth with our range of insurance and investment products.",
    image: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",
    cta: "Explore Investments",
    color: "from-canara-yellow-500 to-canara-orange-600"
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={currentSlideData.image}
          alt={currentSlideData.title}
          className="w-full h-full object-cover transition-all duration-1000"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${currentSlideData.color} opacity-85`}></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight animate-fade-in">
                  {currentSlideData.title}
                </h1>
                <h2 className="text-xl lg:text-2xl font-light opacity-90">
                  {currentSlideData.subtitle}
                </h2>
                <p className="text-lg opacity-80 max-w-lg">
                  {currentSlideData.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-canara-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                  {currentSlideData.cta}
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-canara-blue-600 transition-all flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="text-2xl font-bold">10M+</div>
                  <div className="text-sm opacity-80">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm opacity-80">Secure Banking</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="text-2xl font-bold">85+</div>
                  <div className="text-sm opacity-80">Years of Trust</div>
                </div>
              </div>
            </div>

            {/* Right side - could be used for additional content or kept minimal */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4">
          <button
            onClick={prevSlide}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-canara-yellow-500' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all ml-4"
          >
            {isAutoPlaying ? (
              <div className="w-6 h-6 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full ml-1"></div>
              </div>
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}