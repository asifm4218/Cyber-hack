import { BehaviorData, RiskAssessment, BehaviorModel, BBCAConfig, SwipeGesture, ClickPattern, ScrollPattern } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class BBCAEngine {
  private static readonly STORAGE_KEY = 'bbca_behavior_models';
  private static readonly CONFIG_KEY = 'bbca_config';
  private static readonly ANOMALY_THRESHOLD = 0.7;
  private static readonly REAUTH_THRESHOLD = 0.8;

  private static config: BBCAConfig = {
    enabled: true,
    sensitivity: 'medium',
    monitoringInterval: 5000, // 5 seconds
    anomalyThreshold: 0.7,
    reAuthThreshold: 0.8,
    sessionTimeoutOnAnomaly: 30000, // 30 seconds
    privacyMode: true,
    gdprCompliant: true
  };

  // Behavior Data Collection
  static async collectBehaviorData(): Promise<BehaviorData> {
    const startTime = Date.now();
    
    return {
      loginTime: new Date().toISOString(),
      deviceFingerprint: this.generateDeviceFingerprint(),
      ipAddress: await this.getPublicIP(),
      location: await this.getLocation(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      loginDuration: Date.now() - startTime,
      mouseMovements: this.getMouseMovements(),
      keyboardPattern: 'normal',
      browserLanguage: navigator.language,
      // BBCA Enhanced Metrics
      typingSpeed: this.calculateTypingSpeed(),
      tapPressure: this.getTapPressure(),
      swipeGestures: this.getSwipeGestures(),
      deviceOrientation: this.getDeviceOrientation(),
      scrollPattern: this.getScrollPattern(),
      clickPattern: this.getClickPattern(),
      sessionDuration: this.getSessionDuration(),
      appUsagePattern: this.getAppUsagePattern()
    };
  }

  // AI-Powered Behavior Analysis
  static analyzeBehavior(currentBehavior: BehaviorData, userId: string): RiskAssessment {
    const userModel = this.getUserBehaviorModel(userId);
    let riskScore = 0;
    let behaviorScore = 0;
    const factors: string[] = [];
    const anomalies: string[] = [];

    if (!userModel) {
      // First-time user - create baseline
      this.createBehaviorModel(userId, currentBehavior);
      return {
        level: 'low',
        score: 0,
        factors: ['New user - establishing baseline'],
        recommendations: ['Monitoring behavior patterns'],
        requiresAdditionalAuth: false,
        blockedActions: [],
        confidence: 0.5,
        anomalyDetected: false,
        behaviorScore: 0.5
      };
    }

    // Typing Speed Analysis
    const typingDeviation = Math.abs(currentBehavior.typingSpeed - userModel.typingSpeedBaseline) / userModel.typingSpeedBaseline;
    if (typingDeviation > 0.3) {
      riskScore += 20;
      behaviorScore += 0.2;
      factors.push('Unusual typing speed detected');
      anomalies.push('typing_speed');
    }

    // Tap Pressure Analysis
    const pressureDeviation = this.calculatePressureDeviation(currentBehavior.tapPressure, userModel.tapPressureBaseline);
    if (pressureDeviation > 0.4) {
      riskScore += 25;
      behaviorScore += 0.25;
      factors.push('Abnormal tap pressure pattern');
      anomalies.push('tap_pressure');
    }

    // Swipe Gesture Analysis
    const swipeAnomaly = this.analyzeSwipeGestures(currentBehavior.swipeGestures, userModel.swipeVelocityBaseline);
    if (swipeAnomaly > 0.5) {
      riskScore += 15;
      behaviorScore += 0.15;
      factors.push('Unusual swipe patterns detected');
      anomalies.push('swipe_gestures');
    }

    // Click Pattern Analysis
    const clickAnomaly = this.analyzeClickPatterns(currentBehavior.clickPattern, userModel.clickPatternBaseline);
    if (clickAnomaly > 0.6) {
      riskScore += 20;
      behaviorScore += 0.2;
      factors.push('Abnormal click behavior');
      anomalies.push('click_pattern');
    }

    // Session Duration Analysis
    const sessionDeviation = Math.abs(currentBehavior.sessionDuration - userModel.sessionDurationBaseline) / userModel.sessionDurationBaseline;
    if (sessionDeviation > 0.5) {
      riskScore += 10;
      behaviorScore += 0.1;
      factors.push('Unusual session duration');
      anomalies.push('session_duration');
    }

    // Device Orientation Analysis (Mobile)
    if (this.isMobileDevice()) {
      const orientationAnomaly = this.analyzeDeviceOrientation(currentBehavior.deviceOrientation);
      if (orientationAnomaly > 0.7) {
        riskScore += 15;
        behaviorScore += 0.15;
        factors.push('Unusual device handling detected');
        anomalies.push('device_orientation');
      }
    }

    // Scroll Pattern Analysis
    const scrollAnomaly = this.analyzeScrollPattern(currentBehavior.scrollPattern);
    if (scrollAnomaly > 0.5) {
      riskScore += 10;
      behaviorScore += 0.1;
      factors.push('Abnormal scrolling behavior');
      anomalies.push('scroll_pattern');
    }

    // Update behavior model with new data
    this.updateBehaviorModel(userId, currentBehavior);

    // Determine risk level
    let level: RiskAssessment['level'];
    const anomalyDetected = behaviorScore > this.config.anomalyThreshold;
    const requiresReAuth = behaviorScore > this.config.reAuthThreshold;

    if (riskScore >= 60 || behaviorScore > 0.8) level = 'critical';
    else if (riskScore >= 40 || behaviorScore > 0.6) level = 'high';
    else if (riskScore >= 20 || behaviorScore > 0.4) level = 'medium';
    else level = 'low';

    return {
      level,
      score: riskScore,
      factors,
      recommendations: this.generateRecommendations(level, anomalies),
      requiresAdditionalAuth: requiresReAuth,
      blockedActions: level === 'critical' ? ['transfer', 'settings', 'account_access'] : [],
      confidence: userModel.confidence,
      anomalyDetected,
      behaviorScore
    };
  }

  // Behavior Model Management
  private static createBehaviorModel(userId: string, behaviorData: BehaviorData): void {
    const model: BehaviorModel = {
      userId,
      typingSpeedBaseline: behaviorData.typingSpeed,
      tapPressureBaseline: behaviorData.tapPressure,
      swipeVelocityBaseline: this.calculateAverageSwipeVelocity(behaviorData.swipeGestures),
      scrollSpeedBaseline: behaviorData.scrollPattern.speed,
      clickPatternBaseline: [behaviorData.clickPattern],
      sessionDurationBaseline: behaviorData.sessionDuration,
      lastUpdated: new Date().toISOString(),
      confidence: 0.3 // Low confidence for new model
    };

    this.saveBehaviorModel(model);
  }

  private static updateBehaviorModel(userId: string, behaviorData: BehaviorData): void {
    const model = this.getUserBehaviorModel(userId);
    if (!model) return;

    // Adaptive learning with weighted averages
    const learningRate = 0.1;
    
    model.typingSpeedBaseline = model.typingSpeedBaseline * (1 - learningRate) + behaviorData.typingSpeed * learningRate;
    model.swipeVelocityBaseline = model.swipeVelocityBaseline * (1 - learningRate) + this.calculateAverageSwipeVelocity(behaviorData.swipeGestures) * learningRate;
    model.scrollSpeedBaseline = model.scrollSpeedBaseline * (1 - learningRate) + behaviorData.scrollPattern.speed * learningRate;
    model.sessionDurationBaseline = model.sessionDurationBaseline * (1 - learningRate) + behaviorData.sessionDuration * learningRate;
    
    // Update tap pressure baseline (array)
    model.tapPressureBaseline = model.tapPressureBaseline.map((baseline, index) => 
      baseline * (1 - learningRate) + (behaviorData.tapPressure[index] || baseline) * learningRate
    );

    // Increase confidence over time
    model.confidence = Math.min(1.0, model.confidence + 0.05);
    model.lastUpdated = new Date().toISOString();

    this.saveBehaviorModel(model);
  }

  // Behavior Analysis Methods
  private static calculateTypingSpeed(): number {
    // Simulate typing speed calculation (WPM)
    return Math.random() * 40 + 30; // 30-70 WPM
  }

  private static getTapPressure(): number[] {
    // Simulate tap pressure measurements
    return Array.from({ length: 5 }, () => Math.random() * 100 + 50);
  }

  private static getSwipeGestures(): SwipeGesture[] {
    // Simulate swipe gesture data
    return [
      {
        direction: 'up',
        velocity: Math.random() * 500 + 200,
        distance: Math.random() * 300 + 100,
        timestamp: Date.now()
      }
    ];
  }

  private static getDeviceOrientation(): any {
    // Simulate device orientation data
    return {
      alpha: Math.random() * 360,
      beta: Math.random() * 180 - 90,
      gamma: Math.random() * 180 - 90,
      timestamp: Date.now()
    };
  }

  private static getScrollPattern(): ScrollPattern {
    return {
      speed: Math.random() * 1000 + 200,
      direction: Math.random() > 0.5 ? 'up' : 'down',
      frequency: Math.random() * 10 + 1,
      timestamp: Date.now()
    };
  }

  private static getClickPattern(): ClickPattern {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      pressure: Math.random() * 100 + 20,
      duration: Math.random() * 200 + 50,
      timestamp: Date.now()
    };
  }

  private static getSessionDuration(): number {
    return Date.now() - (parseInt(localStorage.getItem('session_start') || '0') || Date.now());
  }

  private static getAppUsagePattern(): any {
    return {
      screenTime: this.getSessionDuration(),
      featuresUsed: ['dashboard', 'accounts', 'transactions'],
      navigationPattern: ['login', 'dashboard', 'accounts'],
      transactionFrequency: Math.random() * 10
    };
  }

  // Analysis Helper Methods
  private static calculatePressureDeviation(current: number[], baseline: number[]): number {
    if (baseline.length === 0) return 0;
    
    const avgCurrent = current.reduce((a, b) => a + b, 0) / current.length;
    const avgBaseline = baseline.reduce((a, b) => a + b, 0) / baseline.length;
    
    return Math.abs(avgCurrent - avgBaseline) / avgBaseline;
  }

  private static analyzeSwipeGestures(gestures: SwipeGesture[], baseline: number): number {
    if (gestures.length === 0) return 0;
    
    const avgVelocity = gestures.reduce((sum, g) => sum + g.velocity, 0) / gestures.length;
    return Math.abs(avgVelocity - baseline) / baseline;
  }

  private static analyzeClickPatterns(current: ClickPattern, baseline: ClickPattern[]): number {
    if (baseline.length === 0) return 0;
    
    const avgBaseline = baseline.reduce((sum, p) => sum + p.pressure, 0) / baseline.length;
    return Math.abs(current.pressure - avgBaseline) / avgBaseline;
  }

  private static analyzeDeviceOrientation(orientation: any): number {
    // Simulate orientation analysis
    return Math.random() * 0.5; // Random anomaly score
  }

  private static analyzeScrollPattern(pattern: ScrollPattern): number {
    // Simulate scroll pattern analysis
    return Math.random() * 0.4; // Random anomaly score
  }

  private static calculateAverageSwipeVelocity(gestures: SwipeGesture[]): number {
    if (gestures.length === 0) return 300; // Default velocity
    return gestures.reduce((sum, g) => sum + g.velocity, 0) / gestures.length;
  }

  // Utility Methods
  private static generateDeviceFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillText('BBCA-SecureBank', 10, 10);
    }
    
    const fingerprint = {
      canvas: canvas.toDataURL(),
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      userAgent: navigator.userAgent.slice(0, 100),
      memory: (navigator as any).deviceMemory || 'unknown',
      cores: navigator.hardwareConcurrency || 'unknown',
    };

    return btoa(JSON.stringify(fingerprint)).slice(0, 32);
  }

  private static async getPublicIP(): Promise<string> {
    try {
      return '192.168.1.' + Math.floor(Math.random() * 255);
    } catch {
      return 'unknown';
    }
  }

  private static async getLocation(): Promise<string> {
    try {
      const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
      return cities[Math.floor(Math.random() * cities.length)];
    } catch {
      return 'unknown';
    }
  }

  private static getMouseMovements(): number {
    return Math.floor(Math.random() * 100) + 50;
  }

  private static isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Storage Methods
  private static getUserBehaviorModel(userId: string): BehaviorModel | null {
    try {
      const models = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
      return models[userId] || null;
    } catch {
      return null;
    }
  }

  private static saveBehaviorModel(model: BehaviorModel): void {
    try {
      const models = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
      models[model.userId] = model;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(models));
    } catch (error) {
      console.error('Failed to save behavior model:', error);
    }
  }

  private static generateRecommendations(level: string, anomalies: string[]): string[] {
    const recommendations: string[] = [];
    
    if (level === 'critical') {
      recommendations.push('Immediate re-authentication required');
      recommendations.push('Session will be terminated');
      recommendations.push('Contact security team if unauthorized');
    } else if (level === 'high') {
      recommendations.push('Additional verification recommended');
      recommendations.push('Monitor account activity closely');
    } else if (level === 'medium') {
      recommendations.push('Verify recent account activity');
      recommendations.push('Consider updating security settings');
    }

    if (anomalies.includes('typing_speed')) {
      recommendations.push('Unusual typing pattern detected');
    }
    if (anomalies.includes('tap_pressure')) {
      recommendations.push('Different touch pressure detected');
    }
    if (anomalies.includes('device_orientation')) {
      recommendations.push('Unusual device handling detected');
    }

    return recommendations;
  }

  // Configuration Methods
  static getConfig(): BBCAConfig {
    try {
      const saved = localStorage.getItem(this.CONFIG_KEY);
      return saved ? { ...this.config, ...JSON.parse(saved) } : this.config;
    } catch {
      return this.config;
    }
  }

  static updateConfig(newConfig: Partial<BBCAConfig>): void {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem(this.CONFIG_KEY, JSON.stringify(this.config));
  }

  // Continuous Monitoring
  static startContinuousMonitoring(userId: string, onAnomalyDetected: (assessment: RiskAssessment) => void): () => void {
    if (!this.config.enabled) return () => {};

    const interval = setInterval(async () => {
      try {
        const behaviorData = await this.collectBehaviorData();
        const assessment = this.analyzeBehavior(behaviorData, userId);
        
        if (assessment.anomalyDetected || assessment.requiresAdditionalAuth) {
          onAnomalyDetected(assessment);
        }
      } catch (error) {
        console.error('BBCA monitoring error:', error);
      }
    }, this.config.monitoringInterval);

    return () => clearInterval(interval);
  }

  // Privacy and Compliance
  static clearUserData(userId: string): void {
    try {
      const models = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
      delete models[userId];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(models));
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  }

  static exportUserData(userId: string): any {
    if (!this.config.gdprCompliant) return null;
    
    const model = this.getUserBehaviorModel(userId);
    return model ? {
      userId: model.userId,
      lastUpdated: model.lastUpdated,
      confidence: model.confidence,
      // Anonymized behavior patterns only
      behaviorPatterns: 'anonymized'
    } : null;
  }
}