'use client';

import { Eye, EyeOff, CreditCard, Settings as Savings, PiggyBank, TrendingUp } from 'lucide-react';
import { Account } from '../../types';
import { useState } from 'react';

interface AccountCardProps {
  account: Account;
  isBalanceVisible: boolean;
  onToggleBalance: () => void;
}

export default function AccountCard({ account, isBalanceVisible, onToggleBalance }: AccountCardProps) {
  const getAccountIcon = () => {
    switch (account.accountType) {
      case 'checking':
        return <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'savings':
        return <PiggyBank className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'credit':
        return <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'investment':
        return <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />;
      default:
        return <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  const getAccountColors = () => {
    switch (account.accountType) {
      case 'checking':
        return 'from-blue-500 to-blue-600';
      case 'savings':
        return 'from-green-500 to-green-600';
      case 'credit':
        return 'from-purple-500 to-purple-600';
      case 'investment':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: account.currency,
    }).format(Math.abs(amount));
  };

  const isNegative = account.balance < 0;

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${getAccountColors()} p-4 sm:p-6 text-white card-hover`}>
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/10 -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/5 translate-y-8 sm:translate-y-12 -translate-x-8 sm:-translate-x-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            {getAccountIcon()}
            <div>
              <h3 className="font-semibold text-base sm:text-lg capitalize">
                {account.accountType} Account
              </h3>
              <p className="text-white/80 text-xs sm:text-sm">
                {account.accountNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onToggleBalance}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            {isBalanceVisible ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
          </button>
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-white/80 text-xs sm:text-sm">Current Balance</p>
            <p className={`text-lg sm:text-2xl font-bold ${isNegative ? 'text-red-200' : ''}`}>
              {isBalanceVisible ? (
                <>
                  {isNegative && '-'}
                  {formatBalance(account.balance)}
                </>
              ) : (
                '••••••'
              )}
            </p>
          </div>

          {account.accountType === 'credit' && (
            <div>
              <p className="text-white/80 text-xs sm:text-sm">Available Credit</p>
              <p className="text-sm sm:text-lg font-semibold">
                {isBalanceVisible ? formatBalance(account.availableBalance) : '••••••'}
              </p>
            </div>
          )}

          {account.interestRate && (
            <div className="pt-2 border-t border-white/20">
              <p className="text-white/80 text-xs sm:text-sm">Interest Rate</p>
              <p className="text-xs sm:text-sm font-medium">{account.interestRate}% APY</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            ${account.status === 'active' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}
          `}>
            {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
          </span>
          <p className="text-white/60 text-xs">
            Opened {new Date(account.openDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}