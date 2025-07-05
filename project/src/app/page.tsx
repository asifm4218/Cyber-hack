'use client';

import { useAuth } from '../hooks/useAuth';
import Header from '../components/layout/Header';
import Hero from '../components/sections/Hero';
import Services from '../components/sections/Services';
import Products from '../components/sections/Products';
import DigitalBanking from '../components/sections/DigitalBanking';
import NewsUpdates from '../components/sections/NewsUpdates';
import Footer from '../components/layout/Footer';
import QuickActions from '../components/sections/QuickActions';
import AboutSection from '../components/sections/AboutSection';
import Dashboard from '../components/dashboard/Dashboard';
import { useState, useEffect } from 'react';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || isPageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary-600 dark:text-primary-400 font-semibold">Loading Canara Bank...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main className="w-full">
        <Hero />
        <QuickActions />
        <Services />
        <Products />
        <DigitalBanking />
        <AboutSection />
        <NewsUpdates />
      </main>
      <Footer />
    </div>
  );
}