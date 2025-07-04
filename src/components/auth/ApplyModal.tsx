'use client';

import { useState } from 'react';
import { X, CreditCard, User, Mail, Phone, MapPin, Calendar, DollarSign } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApplicationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  income: string;
  employmentType: string;
  productType: string;
}

export default function ApplyModal({ isOpen, onClose }: ApplyModalProps) {
  const [formData, setFormData] = useState<ApplicationForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    income: '',
    employmentType: '',
    productType: 'savings',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      income: '',
      employmentType: '',
      productType: 'savings',
    });
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-success-100 dark:bg-success-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-success-600 dark:text-success-400" />
            </div>
            <h2 className="text-2xl font-bold text-canara-blue-600 dark:text-canara-blue-400 mb-4">
              Application Submitted!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Thank you for your application. We'll review it and get back to you within 2-3 business days.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Application Reference: <span className="font-mono font-bold text-canara-yellow-600">CB{Date.now().toString().slice(-6)}</span>
            </p>
            <button
              onClick={handleClose}
              className="button-primary w-full"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-canara-blue-600 dark:text-canara-blue-400">Apply Now</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-canara-yellow-100 dark:bg-canara-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-canara-yellow-600 dark:text-canara-yellow-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Start your banking journey with us
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Type
              </label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="savings">Savings Account</option>
                <option value="current">Current Account</option>
                <option value="credit-card">Credit Card</option>
                <option value="home-loan">Home Loan</option>
                <option value="personal-loan">Personal Loan</option>
                <option value="fixed-deposit">Fixed Deposit</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="input-field pl-11"
                    placeholder="Enter first name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="input-field pl-11"
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field pl-11"
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field pl-11"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input-field pl-11"
                  placeholder="Enter your address"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="input-field pl-11"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Annual Income
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    name="income"
                    type="number"
                    value={formData.income}
                    onChange={handleInputChange}
                    className="input-field pl-11"
                    placeholder="Enter annual income"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Employment Type
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="">Select employment type</option>
                <option value="salaried">Salaried</option>
                <option value="self-employed">Self Employed</option>
                <option value="business">Business Owner</option>
                <option value="retired">Retired</option>
                <option value="student">Student</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="button-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : <CreditCard className="w-5 h-5" />}
              {isLoading ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-canara-blue-50 dark:bg-canara-blue-900/20 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              By submitting this application, you agree to our Terms of Service and Privacy Policy.
              All information provided will be kept confidential and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}