'use client';

import { useEffect, useState } from 'react';
import { useBBCA } from '../../hooks/useBBCA';
import { Shield, AlertTriangle, Eye, Settings, X } from 'lucide-react';

interface BBCAMonitorProps {
  userId: string | null;
  isAuthenticated: boolean;
  onReAuthRequired: () => void;
  onSessionTimeout: () => void;
}

export default function BBCAMonitor({ 
  userId, 
  isAuthenticated, 
  onReAuthRequired, 
  onSessionTimeout 
}: BBCAMonitorProps) {
  const {
    isMonitoring,
    currentRisk,
    anomalyDetected,
    requiresReAuth,
    config,
    resetAnomalyState,
    updateConfig,
    analyzeCurrentBehavior
  } = useBBCA(userId, isAuthenticated);

  const [showAlert, setShowAlert] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Handle re-authentication requirement
  useEffect(() => {
    if (requiresReAuth) {
      setShowAlert(true);
      onReAuthRequired();
    }
  }, [requiresReAuth, onReAuthRequired]);

  // Handle critical anomalies
  useEffect(() => {
    if (currentRisk?.level === 'critical') {
      setTimeout(() => {
        onSessionTimeout();
      }, config.sessionTimeoutOnAnomaly);
    }
  }, [currentRisk?.level, config.sessionTimeoutOnAnomaly, onSessionTimeout]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const handleDismissAlert = () => {
    setShowAlert(false);
    resetAnomalyState();
  };

  if (!isAuthenticated || !config.enabled) return null;

  return (
    <>
      {/* BBCA Status Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex items-center space-x-2">
          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
          >
            <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Status Indicator */}
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-full shadow-lg border ${
            isMonitoring 
              ? currentRisk 
                ? getRiskColor(currentRisk.level)
                : 'text-green-600 bg-green-50 border-green-200'
              : 'text-gray-600 bg-gray-50 border-gray-200'
          }`}>
            <Shield className="w-4 h-4" />
            <span className="text-xs font-medium">
              {isMonitoring ? 'BBCA Active' : 'BBCA Inactive'}
            </span>
            {currentRisk && (
              <span className="text-xs">
                ({currentRisk.level.toUpperCase()})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Anomaly Alert Modal */}
      {showAlert && anomalyDetected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Behavior Anomaly Detected
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Risk Level: {currentRisk?.level.toUpperCase()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDismissAlert}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Detected Anomalies:
                  </h4>
                  <ul className="space-y-1">
                    {currentRisk?.factors.map((factor, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Recommendations:
                  </h4>
                  <ul className="space-y-1">
                    {currentRisk?.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    <strong>BBCA (Behavior-Based Continuous Authentication)</strong> monitors your 
                    interaction patterns to ensure account security. This alert indicates unusual 
                    behavior that may require verification.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleDismissAlert}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Dismiss
                  </button>
                  {requiresReAuth && (
                    <button
                      onClick={() => {
                        handleDismissAlert();
                        onReAuthRequired();
                      }}
                      className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                    >
                      Re-authenticate
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BBCA Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  BBCA Settings
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={config.enabled}
                      onChange={(e) => updateConfig({ enabled: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Enable BBCA Monitoring
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sensitivity Level
                  </label>
                  <select
                    value={config.sensitivity}
                    onChange={(e) => updateConfig({ sensitivity: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="low">Low - Fewer alerts</option>
                    <option value="medium">Medium - Balanced</option>
                    <option value="high">High - More sensitive</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={config.privacyMode}
                      onChange={(e) => updateConfig({ privacyMode: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Privacy Mode (On-device processing)
                    </span>
                  </label>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-medium text-green-800 dark:text-green-400">
                      GDPR Compliant
                    </span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    All behavior data is processed locally on your device. 
                    No personal behavior patterns are transmitted to our servers.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">
                    How BBCA Works
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                    <li>• Monitors typing speed and patterns</li>
                    <li>• Analyzes touch pressure and gestures</li>
                    <li>• Tracks device handling behavior</li>
                    <li>• Uses AI to detect anomalies</li>
                    <li>• Triggers re-auth when needed</li>
                  </ul>
                </div>

                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}