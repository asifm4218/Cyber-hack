'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar';
import AccountCard from './AccountCard';
import EnhancedBBCAMonitor from '../security/EnhancedBBCAMonitor';
import { mockAccounts, mockTransactions } from '../../utils/mockData';
import { Account, Transaction } from '../../types';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Brain,
  Shield
} from 'lucide-react';

export default function Dashboard() {
  const { user, logout, triggerReAuth, handleReAuthSuccess, getTimeUntilLogout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showReAuthModal, setShowReAuthModal] = useState(false);

  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(Math.floor(getTimeUntilLogout() / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [getTimeUntilLogout]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReAuthRequired = () => {
    setShowReAuthModal(true);
  };

  const handleSessionTimeout = () => {
    alert('Session terminated due to security concerns. Please login again.');
    logout();
  };

  const handleReAuthSubmit = () => {
    // Simulate re-authentication
    setShowReAuthModal(false);
    handleReAuthSuccess();
  };

  const totalBalance = mockAccounts.reduce((sum, account) => sum + account.balance, 0);
  const recentTransactions = mockTransactions.slice(0, 5);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <div className="flex-1 lg:ml-64 flex flex-col">
        <DashboardHeader
          user={user}
          onLogout={logout}
          onMenuToggle={() => setIsSidebarOpen(true)}
        />
        
        {/* Session Timer with BBCA Status */}
        <div className="bg-gradient-to-r from-canara-blue-50 to-canara-yellow-50 dark:from-canara-blue-900/20 dark:to-canara-yellow-900/20 border-b border-canara-blue-200 dark:border-canara-blue-800 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 text-canara-blue-700 dark:text-canara-blue-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Session expires in: {formatTime(timeLeft)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Brain className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    AI Security: Active
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-canara-yellow-700 dark:text-canara-yellow-400">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Bank-Grade Protection
                </span>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Account Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        {isBalanceVisible ? `$${totalBalance.toLocaleString()}` : '••••••'}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-canara-blue-100 dark:bg-canara-blue-900 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-canara-blue-600 dark:text-canara-blue-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active Accounts</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        {mockAccounts.length}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-canara-yellow-100 dark:bg-canara-yellow-900 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-canara-yellow-600 dark:text-canara-yellow-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                      <p className="text-xl sm:text-2xl font-bold text-success-600 dark:text-success-400">
                        +$2,500
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-success-100 dark:bg-success-900 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-success-600 dark:text-success-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Expenses</p>
                      <p className="text-xl sm:text-2xl font-bold text-error-600 dark:text-error-400">
                        -$1,335
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-error-100 dark:bg-error-900 rounded-lg flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-error-600 dark:text-error-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Accounts */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Accounts</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {mockAccounts.map((account) => (
                    <AccountCard
                      key={account.id}
                      account={account}
                      isBalanceVisible={isBalanceVisible}
                      onToggleBalance={() => setIsBalanceVisible(!isBalanceVisible)}
                    />
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'credit' 
                              ? 'bg-success-100 dark:bg-success-900' 
                              : 'bg-error-100 dark:bg-error-900'
                          }`}>
                            {transaction.type === 'credit' ? (
                              <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5 text-success-600 dark:text-success-400" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-error-600 dark:text-error-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{transaction.description}</p>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{transaction.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold text-sm sm:text-base ${
                            transaction.type === 'credit' 
                              ? 'text-success-600 dark:text-success-400' 
                              : 'text-error-600 dark:text-error-400'
                          }`}>
                            {transaction.type === 'credit' ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection !== 'overview' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 capitalize">
                {activeSection.replace('-', ' ')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                This section is under development. More features coming soon!
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Enhanced BBCA Monitor */}
      <EnhancedBBCAMonitor
        userId={user.id}
        isAuthenticated={true}
        onReAuthRequired={handleReAuthRequired}
        onSessionTimeout={handleSessionTimeout}
      />

      {/* Re-Authentication Modal */}
      {showReAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  AI Security Verification
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our AI detected unusual behavior. Please verify your identity to continue.
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-canara-blue-500 focus:border-transparent"
                />
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowReAuthModal(false)}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReAuthSubmit}
                    className="flex-1 bg-canara-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-canara-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Verify</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}