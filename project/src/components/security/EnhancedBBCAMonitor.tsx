'use client';

import { useEffect, useState } from 'react';
import { useEnhancedBBCA } from '../../hooks/useEnhancedBBCA';
import { 
  Shield, 
  AlertTriangle, 
  Battery, 
  Smartphone, 
  Activity,
  Settings, 
  X,
  Eye,
  Brain,
  Zap,
  Lock
} from 'lucide-react';

interface EnhancedBBCAMonitorProps {
  userId: string | null;
  isAuthenticated: boolean;
  onReAuthRequired: () => void;
  onSessionTimeout: () => void;
}

export default function EnhancedBBCAMonitor({ 
  userId, 
  isAuthenticated, 
  onReAuthRequired, 
  onSessionTimeout 
}: EnhancedBBCAMonitorProps) {
  const {
    isInitialized,
    isMonitoring,
    currentRisk,
    anomalyDetected,
    requiresReAuth,
    config,
    batteryOptimized,
    securityEvents,
    resetAnomalyState,
    updateConfig,
    trainUserModel
  } = useEnhancedBBCA(userId, isAuthenticated);

  const [showAlert, setShowAlert] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isTrainingModel, setIsTrainingModel] = useState(false);

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

  // Listen for critical alerts
  useEffect(() => {
    const handleCriticalAlert = (event: any) => {
      setShowAlert(true);
      console.error('🚨 Critical BBCA Alert:', event.detail);
    };

    const handleHighRiskAlert = (event: any) => {
      setShowAlert(true);
      console.warn('⚠️ High Risk BBCA Alert:', event.detail);
    };

    window.addEventListener('bbca-critical-alert', handleCriticalAlert);
    window.addEventListener('bbca-high-risk-alert', handleHighRiskAlert);

    return () => {
      window.removeEventListener('bbca-critical-alert', handleCriticalAlert);
      window.removeEventListener('bbca-high-risk-alert', handleHighRiskAlert);
    };
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      default: return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
    }
  };

  const handleDismissAlert = () => {
    setShowAlert(false);
    resetAnomalyState();
  };

  const handleTrainModel = async () => {
    setIsTrainingModel(true);
    try {
      const result = await trainUserModel();
      if (result) {
        alert('Model training completed successfully!');
      } else {
        alert('Model training failed. Please try again later.');
      }
    } catch (error) {
      alert('Model training error. Please try again.');
    } finally {
      setIsTrainingModel(false);
    }
  };

  if (!isAuthenticated || !config.enabled) return null;

  return (
    <>
      {/* Enhanced BBCA Status Panel */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex flex-col items-end space-y-2">
          {/* Battery Status (Mobile) */}
          {batteryOptimized && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-full shadow-lg">
              <Battery className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
                Battery Optimized
              </span>
            </div>
          )}

          {/* Main Control Panel */}
          <div className="flex items-center space-x-2">
            {/* Details Button */}
            <button
              onClick={() => setShowDetails(true)}
              className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
            >
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>

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
                  : 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                : 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-700'
            }`}>
              <div className="flex items-center space-x-1">
                <Brain className="w-4 h-4" />
                <Smartphone className="w-3 h-3" />
              </div>
              <span className="text-xs font-medium">
                {isInitialized ? (isMonitoring ? 'AI Active' : 'AI Ready') : 'Initializing...'}
              </span>
              {currentRisk && (
                <span className="text-xs">
                  ({currentRisk.level.toUpperCase()})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Anomaly Alert Modal */}
      {showAlert && anomalyDetected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      AI Behavior Analysis Alert
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Risk Level: {currentRisk?.level.toUpperCase()} | Confidence: {((currentRisk?.confidence || 0) * 100).toFixed(0)}%
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
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-blue-800 dark:text-blue-400">
                      AI Analysis Results
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700 dark:text-blue-400">Behavior Score:</span>
                      <div className="font-mono text-blue-900 dark:text-blue-300">
                        {((currentRisk?.behaviorScore || 0) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-blue-700 dark:text-blue-400">Risk Score:</span>
                      <div className="font-mono text-blue-900 dark:text-blue-300">
                        {(currentRisk?.score || 0).toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>

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
                    AI Recommendations:
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

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <p className="text-xs text-green-700 dark:text-green-400">
                    <strong>Enhanced BBCA</strong> uses advanced AI and mobile sensors to continuously 
                    monitor your behavior patterns. This alert indicates unusual activity that may 
                    require verification for your security.
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
                      className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Re-authenticate</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Enhanced BBCA Settings
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={config.enabled}
                        onChange={(e) => updateConfig({ enabled: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        Enable AI Monitoring
                      </span>
                    </label>
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
                        Privacy Mode
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    AI Sensitivity Level
                  </label>
                  <select
                    value={config.sensitivity}
                    onChange={(e) => updateConfig({ sensitivity: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="low">Low - Fewer alerts, higher thresholds</option>
                    <option value="medium">Medium - Balanced detection</option>
                    <option value="high">High - More sensitive, earlier detection</option>
                  </select>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-3 flex items-center space-x-2">
                    <Brain className="w-5 h-5" />
                    <span>AI Model Training</span>
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
                    Train a personalized AI model based on your behavior patterns for improved accuracy.
                  </p>
                  <button
                    onClick={handleTrainModel}
                    disabled={isTrainingModel}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    <Brain className="w-4 h-4" />
                    <span>{isTrainingModel ? 'Training...' : 'Train AI Model'}</span>
                  </button>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-medium text-green-800 dark:text-green-400">
                      Privacy & Security
                    </span>
                  </div>
                  <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                    <li>✓ All AI processing happens on your device</li>
                    <li>✓ Behavior patterns never leave your device</li>
                    <li>✓ GDPR compliant data handling</li>
                    <li>✓ Battery optimized algorithms</li>
                    <li>✓ Real-time fraud detection</li>
                  </ul>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-purple-800 dark:text-purple-400 mb-2">
                    Enhanced BBCA Features
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-purple-700 dark:text-purple-400">
                    <div>• Typing pattern analysis</div>
                    <div>• Touch pressure monitoring</div>
                    <div>• Swipe gesture recognition</div>
                    <div>• Device orientation tracking</div>
                    <div>• Scroll behavior analysis</div>
                    <div>• Mouse movement patterns</div>
                    <div>• Session duration modeling</div>
                    <div>• App usage analytics</div>
                  </div>
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

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  BBCA Status Details
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {isInitialized ? (isMonitoring ? 'Active' : 'Ready') : 'Initializing'}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Risk Level</div>
                    <div className={`font-semibold ${
                      currentRisk?.level === 'critical' ? 'text-red-600' :
                      currentRisk?.level === 'high' ? 'text-orange-600' :
                      currentRisk?.level === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {currentRisk?.level?.toUpperCase() || 'LOW'}
                    </div>
                  </div>
                </div>

                {currentRisk && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Current Analysis
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Behavior Score:</span>
                        <span className="font-mono">{((currentRisk.behaviorScore || 0) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
                        <span className="font-mono">{((currentRisk.confidence || 0) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Anomaly Detected:</span>
                        <span className={currentRisk.anomalyDetected ? 'text-red-600' : 'text-green-600'}>
                          {currentRisk.anomalyDetected ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Recent Security Events
                  </h4>
                  {securityEvents.length > 0 ? (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {securityEvents.slice(0, 3).map((event, index) => (
                        <div key={index} className="text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">{event.eventType}</span>
                            <span className={`text-xs ${
                              event.severity === 'high' ? 'text-red-600' :
                              event.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {event.severity}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(event.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No recent events</p>
                  )}
                </div>

                <button
                  onClick={() => setShowDetails(false)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}