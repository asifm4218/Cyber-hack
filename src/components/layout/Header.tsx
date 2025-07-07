'use client';

import { useState } from 'react';
import { 
  Menu, 
  X, 
  Search, 
  Globe, 
  Phone, 
  Mail,
  MapPin,
  ChevronDown,
  User,
  CreditCard,
  Building2,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';
import { useAuthContext } from '../../hooks/AuthContext';
import LoginModal from '../auth/LoginModal';
import ApplyModal from '../auth/ApplyModal';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuthContext();

  const navigationItems = [
    {
      label: 'Personal Banking',
      href: '#',
      dropdown: [
        'Savings Account',
        'Current Account',
        'Fixed Deposits',
        'Recurring Deposits',
        'Personal Loans',
        'Home Loans',
        'Car Loans',
        'Credit Cards'
      ]
    },
    {
      label: 'Corporate Banking',
      href: '#',
      dropdown: [
        'Current Account',
        'Cash Management',
        'Trade Finance',
        'Working Capital',
        'Term Loans',
        'Treasury Services'
      ]
    },
    {
      label: 'Digital Banking',
      href: '#',
      dropdown: [
        'Internet Banking',
        'Mobile Banking',
        'UPI Services',
        'Digital Payments',
        'Online Services'
      ]
    },
    {
      label: 'Investments',
      href: '#',
      dropdown: [
        'Mutual Funds',
        'Insurance',
        'Demat Account',
        'Government Securities',
        'Gold Investment'
      ]
    },
    {
      label: 'NRI Services',
      href: '#',
      dropdown: [
        'NRI Accounts',
        'Money Transfer',
        'Investment Options',
        'Loan Services'
      ]
    }
  ];

  return (
    <>
      {/* Top Bar - Canara Blue */}
      <div className="canara-gradient text-white py-2 px-4 safe-area-top">
        <div className="container-responsive">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="hidden sm:flex items-center space-x-4 lg:space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden md:inline">1800-425-0018</span>
                <span className="md:hidden">Call Us</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden lg:inline">customercare@canarabank.com</span>
                <span className="lg:hidden">Email</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Find Branch/ATM</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-xs">Available in:</span>
                <span className="bg-canara-yellow-500 text-gray-900 px-2 py-1 rounded text-xs font-semibold">
                  Hindi
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                <select className="bg-transparent text-white text-xs sm:text-sm border-none outline-none">
                  <option value="en" className="text-gray-900">English</option>
                  <option value="hi" className="text-gray-900">हिंदी</option>
                  <option value="kn" className="text-gray-900">ಕನ್ನಡ</option>
                </select>
              </div>
              <button
                onClick={toggleTheme}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                {theme === 'light' ? <Moon className="w-3 h-3 sm:w-4 sm:h-4" /> : <Sun className="w-3 h-3 sm:w-4 sm:h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - White with Canara branding */}
      <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-40">
        <div className="container-responsive">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img
                src="/canara-logo.webp"
                alt="Canara Bank Logo"
                className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
                style={{ background: 'white', borderRadius: '8px' }}
              />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-canara-blue-600 dark:text-canara-blue-400">Canara Bank</h1>
                <p className="text-xs text-canara-yellow-600 dark:text-canara-yellow-500 font-medium hidden sm:block">Together We Can</p>
              </div>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Type to search"
                  className="w-full px-4 py-2 pl-4 pr-12 rounded-full border-2 border-canara-blue-200 focus:border-canara-blue-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-canara-blue-600 hover:bg-canara-blue-700 text-white p-2 rounded-full transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navigationItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-canara-blue-600 dark:hover:text-canara-blue-400 font-medium py-2 transition-colors text-sm xl:text-base">
                    <span>{item.label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {activeDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      {item.dropdown.map((subItem) => (
                        <a
                          key={subItem}
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-canara-blue-50 dark:hover:bg-canara-blue-900/20 hover:text-canara-blue-600 dark:hover:text-canara-blue-400 transition-colors"
                        >
                          {subItem}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-canara-blue-600 dark:hover:text-canara-blue-400 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              {/* Always show Login and Apply Now buttons, not just on md+ screens */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700 dark:text-gray-300 hidden lg:block">
                    Welcome, {user?.fullName.split(' ')[0]}
                  </span>
                  <button
                    onClick={logout}
                    className="bg-error-600 hover:bg-error-700 text-white px-3 py-2 sm:px-4 rounded-lg transition-colors text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="flex items-center space-x-2 canara-gradient hover:from-canara-blue-700 hover:to-canara-blue-800 text-white px-3 py-2 sm:px-4 rounded-lg transition-all text-sm"
                  >
                    <User className="w-4 h-4" />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => setIsApplyModalOpen(true)}
                    className="flex items-center space-x-2 canara-gradient-yellow hover:from-canara-yellow-600 hover:to-canara-orange-600 text-gray-900 px-3 py-2 sm:px-4 rounded-lg transition-all font-semibold text-sm"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="hidden sm:inline">Apply Now</span>
                    <span className="sm:hidden">Apply</span>
                  </button>
                </>
              )}
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-canara-blue-600 dark:hover:text-canara-blue-400 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
            <div className="container-responsive py-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative md:hidden">
                <input
                  type="text"
                  placeholder="Type to search"
                  className="w-full px-4 py-2 pl-4 pr-12 rounded-full border-2 border-canara-blue-200 focus:border-canara-blue-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-canara-blue-600 text-white p-2 rounded-full">
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {navigationItems.map((item) => (
                <div key={item.label} className="space-y-2">
                  <button className="flex items-center justify-between w-full text-left text-gray-700 dark:text-gray-300 font-medium py-2">
                    <span>{item.label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="pl-4 space-y-2">
                    {item.dropdown.slice(0, 4).map((subItem) => (
                      <a
                        key={subItem}
                        href="#"
                        className="block text-sm text-gray-600 dark:text-gray-400 py-1 hover:text-canara-blue-600 dark:hover:text-canara-blue-400"
                      >
                        {subItem}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      Good morning, {user?.fullName || 'User'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Welcome back to Canara Bank Pro
                    </p>
                    <button
                      onClick={logout}
                      className="w-full bg-error-600 hover:bg-error-700 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setIsLoginModalOpen(true)}
                      className="w-full canara-gradient hover:from-canara-blue-700 hover:to-canara-blue-800 text-white py-3 rounded-lg font-medium transition-all"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setIsApplyModalOpen(true)}
                      className="w-full canara-gradient-yellow hover:from-canara-yellow-600 hover:to-canara-orange-600 text-gray-900 py-3 rounded-lg font-medium transition-all"
                    >
                      Apply Now
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <ApplyModal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} />
    </>
  );
}