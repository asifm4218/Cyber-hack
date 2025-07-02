'use client';

import { useState, useEffect, useCallback } from 'react';
import { enhancedBBCA } from '../utils/enhancedBBCA';
import { bbcaClient } from '../utils/bbcaClient';
import { RiskAssessment, BBCAConfig } from '../types';

interface EnhancedBBCAState {
  isInitialized: boolean;
  isMonitoring: boolean;
  currentRisk: RiskAssessment | null;
  anomalyDetected: boolean;
  requiresReAuth: boolean;
  config: BBCAConfig;
  batteryOptimized: boolean;
  securityEvents: any[];
}

export function useEnhancedBBCA(userId: string | null, isAuthenticated: boolean) {
  const [bbcaState, setBBCAState] = useState<EnhancedBBCAState>({
    isInitialized: false,
    isMonitoring: false,
    currentRisk: null,
    anomalyDetected: false,
    requiresReAuth: false,
    config: {
      enabled: true,
      sensitivity: 'medium',
      monitoringInterval: 5000,
      anomalyThreshold: 0.7,
      reAuthThreshold: 0.8,
      sessionTimeoutOnAnomaly: 30000,
      privacyMode: true,
      gdprCompliant: true
    },
    batteryOptimized: false,
    securityEvents: []
  });

  const [monitoringInterval, setMonitoringInterval] = useState<NodeJS.Timeout | null>(null);

  // Initialize Enhanced BBCA
  const initializeBBCA = useCallback(async () => {
    if (bbcaState.isInitialized) return;

    try {
      const initialized = await enhancedBBCA.initialize();
      if (initialized) {
        // Connect to backend
        if (userId) {
          bbcaClient.connect(userId);
        }

        setBBCAState(prev => ({
          ...prev,
          isInitialized: true
        }));

        console.log('✅ Enhanced BBCA initialized successfully');
      }
    } catch (error) {
      console.error('Enhanced BBCA initialization failed:', error);
    }
  }, [bbcaState.isInitialized, userId]);

  // Start continuous monitoring
  const startMonitoring = useCallback(async () => {
    if (!userId || !isAuthenticated || !bbcaState.isInitialized || bbcaState.isMonitoring) {
      return;
    }

    console.log('🔍 Starting Enhanced BBCA monitoring...');

    const monitoringIntervalMs = enhancedBBCA.getOptimalMonitoringInterval();
    
    const interval = setInterval(async () => {
      try {
        const riskAssessment = await enhancedBBCA.analyzeBehavior(userId);
        
        setBBCAState(prev => ({
          ...prev,
          currentRisk: riskAssessment,
          anomalyDetected: riskAssessment.anomalyDetected,
          requiresReAuth: riskAssessment.requiresAdditionalAuth
        }));

        // Handle high-risk situations
        if (riskAssessment.level === 'critical') {
          console.warn('🚨 Critical behavior anomaly detected!', riskAssessment);
          handleCriticalAnomaly(riskAssessment);
        } else if (riskAssessment.level === 'high') {
          console.warn('⚠️ High-risk behavior detected', riskAssessment);
          handleHighRiskBehavior(riskAssessment);
        }

      } catch (error) {
        console.error('BBCA monitoring error:', error);
      }
    }, monitoringIntervalMs);

    setMonitoringInterval(interval);
    setBBCAState(prev => ({
      ...prev,
      isMonitoring: true
    }));

  }, [userId, isAuthenticated, bbcaState.isInitialized, bbcaState.isMonitoring]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
      setMonitoringInterval(null);
    }

    setBBCAState(prev => ({
      ...prev,
      isMonitoring: false,
      currentRisk: null,
      anomalyDetected: false,
      requiresReAuth: false
    }));

    console.log('🛑 Enhanced BBCA monitoring stopped');
  }, [monitoringInterval]);

  // Handle critical anomaly
  const handleCriticalAnomaly = useCallback((risk: RiskAssessment) => {
    // Emit critical alert event
    window.dispatchEvent(new CustomEvent('bbca-critical-alert', {
      detail: { risk, userId, timestamp: Date.now() }
    }));
  }, [userId]);

  // Handle high-risk behavior
  const handleHighRiskBehavior = useCallback((risk: RiskAssessment) => {
    // Emit high-risk alert event
    window.dispatchEvent(new CustomEvent('bbca-high-risk-alert', {
      detail: { risk, userId, timestamp: Date.now() }
    }));
  }, [userId]);

  // Reset anomaly state
  const resetAnomalyState = useCallback(() => {
    setBBCAState(prev => ({
      ...prev,
      anomalyDetected: false,
      requiresReAuth: false,
      currentRisk: null
    }));
  }, []);

  // Update configuration
  const updateConfig = useCallback(async (newConfig: Partial<BBCAConfig>) => {
    try {
      await bbcaClient.updateConfig(newConfig);
      setBBCAState(prev => ({
        ...prev,
        config: { ...prev.config, ...newConfig }
      }));
    } catch (error) {
      console.error('Config update failed:', error);
    }
  }, []);

  // Get security events
  const loadSecurityEvents = useCallback(async () => {
    if (!userId) return;

    try {
      const result = await bbcaClient.getSecurityEvents(userId);
      setBBCAState(prev => ({
        ...prev,
        securityEvents: result.events || []
      }));
    } catch (error) {
      console.error('Failed to load security events:', error);
    }
  }, [userId]);

  // Train user model
  const trainUserModel = useCallback(async () => {
    if (!userId) return;

    try {
      const result = await bbcaClient.trainUserModel(userId);
      console.log('Model training result:', result);
      return result;
    } catch (error) {
      console.error('Model training failed:', error);
      return null;
    }
  }, [userId]);

  // Handle security alerts from backend
  useEffect(() => {
    const handleSecurityAlert = (data: any) => {
      console.warn('🚨 Backend security alert:', data);
      setBBCAState(prev => ({
        ...prev,
        anomalyDetected: true,
        requiresReAuth: data.riskLevel === 'high' || data.riskLevel === 'critical'
      }));
    };

    bbcaClient.onSecurityAlert(handleSecurityAlert);

    return () => {
      bbcaClient.offSecurityAlert(handleSecurityAlert);
    };
  }, []);

  // Handle battery optimization
  useEffect(() => {
    const handleLowPowerMode = (event: any) => {
      setBBCAState(prev => ({
        ...prev,
        batteryOptimized: event.detail.enabled
      }));

      if (event.detail.enabled && bbcaState.isMonitoring) {
        // Restart monitoring with optimized interval
        stopMonitoring();
        setTimeout(startMonitoring, 1000);
      }
    };

    window.addEventListener('bbca-low-power-mode', handleLowPowerMode);

    return () => {
      window.removeEventListener('bbca-low-power-mode', handleLowPowerMode);
    };
  }, [bbcaState.isMonitoring, startMonitoring, stopMonitoring]);

  // Initialize when authenticated
  useEffect(() => {
    if (isAuthenticated && userId && !bbcaState.isInitialized) {
      initializeBBCA();
    }
  }, [isAuthenticated, userId, bbcaState.isInitialized, initializeBBCA]);

  // Start/stop monitoring based on authentication
  useEffect(() => {
    if (isAuthenticated && userId && bbcaState.isInitialized && bbcaState.config.enabled) {
      startMonitoring();
      loadSecurityEvents();
    } else {
      stopMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [isAuthenticated, userId, bbcaState.isInitialized, bbcaState.config.enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
      enhancedBBCA.cleanup();
      bbcaClient.disconnect();
    };
  }, [stopMonitoring]);

  return {
    ...bbcaState,
    initializeBBCA,
    startMonitoring,
    stopMonitoring,
    resetAnomalyState,
    updateConfig,
    loadSecurityEvents,
    trainUserModel
  };
}