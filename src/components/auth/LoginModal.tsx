'use client';

import { useState } from 'react';
import { X, Eye, EyeOff, Lock, User, Shield } from 'lucide-react';
import { useAuthContext } from '../../hooks/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../ui/LoadingSpinner';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthContext();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        onClose();
        setFormData({ username: '', password: '' });
        router.replace('/');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      username: 'demo',
      password: 'SecureBank123!'
    });
    setError('');
  };

  const handleClose = () => {
    setFormData({ username: '', password: '' });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 modal-backdrop">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full h-full max-h-screen sm:max-w-md animate-slide-up modal-content mx-2 sm:mx-0 p-2 sm:p-0 overflow-y-auto flex flex-col justify-center">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold text-canara-blue-600 dark:text-canara-blue-400">Sign In</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-canara-blue-100 dark:bg-canara-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-canara-blue-600 dark:text-canara-blue-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back to Canara Bank
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="input-field pl-11"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field pl-11 pr-11"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
                <p className="text-error-700 dark:text-error-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : <Lock className="w-5 h-5" />}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-canara-blue-600 hover:text-canara-blue-700 text-sm font-medium">
              Forgot your password?
            </a>
          </div>

          <div className="mt-6 p-4 bg-canara-blue-50 dark:bg-canara-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Demo Credentials:</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center justify-between">
                <span>Username:</span>
                <span className="font-mono bg-canara-yellow-200 dark:bg-canara-yellow-800 px-2 py-1 rounded">demo</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Password:</span>
                <span className="font-mono bg-canara-yellow-200 dark:bg-canara-yellow-800 px-2 py-1 rounded text-xs">SecureBank123!</span>
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full mt-3 bg-canara-yellow-500 hover:bg-canara-yellow-600 text-gray-900 py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Use Demo Credentials
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}