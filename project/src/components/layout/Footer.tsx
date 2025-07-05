'use client';

import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Youtube,
  ArrowRight,
  Shield,
  Award,
  Globe
} from 'lucide-react';

const footerLinks = {
  'Personal Banking': [
    'Savings Account',
    'Current Account',
    'Fixed Deposits',
    'Personal Loans',
    'Home Loans',
    'Credit Cards'
  ],
  'Corporate Banking': [
    'Current Account',
    'Cash Management',
    'Trade Finance',
    'Working Capital',
    'Term Loans',
    'Treasury Services'
  ],
  'Digital Services': [
    'Internet Banking',
    'Mobile Banking',
    'UPI Services',
    'Digital Payments',
    'Online Services',
    'Mobile App'
  ],
  'Support': [
    'Customer Care',
    'Branch Locator',
    'ATM Locator',
    'Contact Us',
    'Complaints',
    'Feedback'
  ]
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' }
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Canara Bank</h3>
                <p className="text-sm text-gray-400">Together We Can</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              India's leading public sector bank with over 85 years of excellence in banking services. 
              Trusted by millions for secure, innovative, and customer-centric financial solutions.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-500" />
                <span className="text-gray-300">1800-425-0018 (Toll Free)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-500" />
                <span className="text-gray-300">customercare@canarabank.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-orange-500" />
                <span className="text-gray-300">Head Office: Bangalore, India</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-lg font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-orange-400 transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-xl font-semibold text-white mb-2">Stay Connected</h4>
              <p className="text-gray-300">
                Subscribe to our newsletter for the latest banking updates, offers, and financial insights.
              </p>
            </div>
            <div className="flex space-x-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center space-x-2">
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Shield className="w-8 h-8 text-green-500" />
              <div className="text-left">
                <div className="font-semibold text-white">RBI Regulated</div>
                <div className="text-sm text-gray-400">Government Backed Security</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Award className="w-8 h-8 text-blue-500" />
              <div className="text-left">
                <div className="font-semibold text-white">ISO Certified</div>
                <div className="text-sm text-gray-400">Quality Management System</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Globe className="w-8 h-8 text-purple-500" />
              <div className="text-left">
                <div className="font-semibold text-white">Global Presence</div>
                <div className="text-sm text-gray-400">150+ Countries Worldwide</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024 Canara Bank. All rights reserved. | 
              <a href="#" className="hover:text-orange-400 ml-1">Privacy Policy</a> | 
              <a href="#" className="hover:text-orange-400 ml-1">Terms of Service</a> | 
              <a href="#" className="hover:text-orange-400 ml-1">Sitemap</a>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>IFSC: CNRB0000001</span>
              <span>SWIFT: CNRBINBB</span>
              <span>CIN: U65191KA1906PLC001128</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">
              Canara Bank is regulated by the Reserve Bank of India. 
              Deposits are insured by DICGC up to the limit applicable as per the policy of DICGC.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}