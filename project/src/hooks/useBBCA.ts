'use client';

import { useState, useEffect, useCallback } from 'react';
import { BBCAEngine } from '../utils/bbcaEngine';
import { RiskAssessment, BBCAConfig } from '../types';

interface BBCAState {
  isMonitoring: boolean;
  currentRisk: RiskAssessment | null;
  anomalyDetected: boolean;
  requiresReAuth: boolean;
  config: BBCAConfig;
}

export function useBBCA(userId: string | null, isAuthenticated: boolean) {
  const [bbcaState, setBBCAState] = useState<BBCAState>({
    isMonitoring: false,
    currentRisk: null,
    anomalyDetected: false,
    requiresReAuth: false,
    config: BBCAEngine.getConfig()
  });

  const [monitoringCleanup, setMonitoringCleanup] = useState<(() => void) | null>(null);

  // Handle anomaly detection
  const handleAnomalyDetected = useCallback((assessment: RiskAssessment) => {
    setBBCAState(prev => ({
      ...prev,
      currentRisk: assessment,
      anomalyDetected: assessment.anomalyDetected,
      requiresReAuth: assessment.requiresAdditionalAuth
    }));

    // Trigger alerts based on risk level
    if (assessment.level === 'critical') {
      console.warn('🚨 BBCA: Critical behavior anomaly detected!', assessment);
    } else if (assessment.level === 'high') {
      console.warn('⚠️ BBCA: High-risk behavior detected', assessment);
    }
  }, []);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (!userId || !isAuthenticated || bbcaState.isMonitoring) return;

    console.log('🔍 BBCA: Starting continuous behavior monitoring...');
    
    const cleanup = BBCAEngine.startContinuousMonitoring(userId, handleAnomalyDetected);
    setMonitoringCleanup(() => cleanup);
    
    setBBCAState(prev => ({
      ...prev,
      isMonitoring: true
    }));
  }, [userId, isAuthenticated, bbcaState.isMonitoring, handleAnomalyDetected]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    if (monitoringCleanup) {
      monitoringCleanup();
      setMonitoringCleanup(null);
    }
    
    setBBCAState(prev => ({
      ...prev,
      isMonitoring: false,
      currentRisk: null,
      anomalyDetected: false,
      requiresReAuth: false
    }));
    
    console.log('🛑 BBCA: Stopped behavior monitoring');
  }, [monitoringCleanup]);

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
  const updateConfig = useCallback((newConfig: Partial<BBCAConfig>) => {
    BBCAEngine.updateConfig(newConfig);
    setBBCAState(prev => ({
      ...prev,
      config: { ...prev.config, ...newConfig }
    }));
  }, []);

  // Analyze current behavior
  const analyzeCurrentBehavior = useCallback(async () => {
    if (!userId) return null;
    
    try {
      const behaviorData = await BBCAEngine.collectBehaviorData();
      const assessment = BBCAEngine.analyzeBehavior(behaviorData, userId);
      
      setBBCAState(prev => ({
        ...prev,
        currentRisk: assessment
      }));
      
      return assessment;
    } catch (error) {
      console.error('BBCA analysis error:', error);
      return null;
    }
  }, [userId]);

  // Start/stop monitoring based on authentication state
  useEffect(() => {
    if (isAuthenticated && userId && bbcaState.config.enabled) {
      startMonitoring();
    } else {
      stopMonitoring();
    }

    return () => {
      if (monitoringCleanup) {
        monitoringCleanup();
      }
    };
  }, [isAuthenticated, userId, bbcaState.config.enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    ...bbcaState,
    startMonitoring,
    stopMonitoring,
    resetAnomalyState,
    updateConfig,
    analyzeCurrentBehavior
  };
}