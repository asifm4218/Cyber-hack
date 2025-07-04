'use client';

import { useState } from 'react';
import { User, Bell, Settings, LogOut, Shield, Menu } from 'lucide-react';
import { User as UserType } from '../../types';

interface DashboardHeaderProps {
  user: UserType;
  onLogout: () => void;
  onMenuToggle: () => void;
}

export default function DashboardHeader({ user, onLogout, onMenuToggle }: DashboardHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Good morning, {user.fullName.split(' ')[0]}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Welcome back to Canara Bank Pro
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.fullName}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" />
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.fullName}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {user.accountNumber}
                </p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <User className="w-4 h-4" />
                  Account Settings
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Shield className="w-4 h-4" />
                  Security Center
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Settings className="w-4 h-4" />
                  Preferences
                </button>
                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}