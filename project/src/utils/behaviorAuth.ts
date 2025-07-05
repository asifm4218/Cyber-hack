import { BehaviorData, LoginAttempt, RiskAssessment } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class BehaviorAuthenticator {
  private static readonly STORAGE_KEY = 'banking_behavior_history';
  private static readonly MAX_HISTORY = 50;

  static generateDeviceFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillText('SecureBank', 10, 10);
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

  static async collectBehaviorData(): Promise<BehaviorData> {
    const startTime = Date.now();
    
    // Simulate collecting behavior data
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      loginTime: new Date().toISOString(),
      deviceFingerprint: this.generateDeviceFingerprint(),
      ipAddress: await this.getPublicIP(),
      location: await this.getLocation(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      loginDuration: Date.now() - startTime,
      mouseMovements: Math.floor(Math.random() * 100) + 50,
      keyboardPattern: 'normal',
      browserLanguage: navigator.language,
    };
  }

  private static async getPublicIP(): Promise<string> {
    try {
      // In a real app, you'd call an IP service
      return '192.168.1.' + Math.floor(Math.random() * 255);
    } catch {
      return 'unknown';
    }
  }

  private static async getLocation(): Promise<string> {
    try {
      // In a real app, you'd use geolocation API
      const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
      return cities[Math.floor(Math.random() * cities.length)];
    } catch {
      return 'unknown';
    }
  }

  static assessRisk(currentBehavior: BehaviorData, username: string): RiskAssessment {
    const history = this.getLoginHistory(username);
    let riskScore = 0;
    const factors: string[] = [];
    const recommendations: string[] = [];

    // Device fingerprint analysis
    const knownDevices = history.map(h => h.behaviorData.deviceFingerprint);
    if (!knownDevices.includes(currentBehavior.deviceFingerprint)) {
      riskScore += 30;
      factors.push('New device detected');
      recommendations.push('Verify device identity');
    }

    // Location analysis
    const knownLocations = history.map(h => h.behaviorData.location);
    if (!knownLocations.includes(currentBehavior.location)) {
      riskScore += 20;
      factors.push('Login from new location');
      recommendations.push('Confirm location access');
    }

    // Time analysis
    const loginHour = new Date(currentBehavior.loginTime).getHours();
    const usualHours = history.map(h => new Date(h.behaviorData.loginTime).getHours());
    const isUnusualTime = usualHours.length > 0 && !usualHours.some(h => Math.abs(h - loginHour) <= 2);
    
    if (isUnusualTime) {
      riskScore += 15;
      factors.push('Unusual login time');
    }

    // Recent failed attempts
    const recentFailed = history.filter(h => 
      !h.success && 
      Date.now() - new Date(h.timestamp).getTime() < 3600000 // 1 hour
    ).length;

    if (recentFailed > 2) {
      riskScore += 40;
      factors.push('Multiple recent failed attempts');
      recommendations.push('Account temporarily restricted');
    }

    // Determine risk level
    let level: RiskAssessment['level'];
    if (riskScore >= 60) level = 'critical';
    else if (riskScore >= 40) level = 'high';
    else if (riskScore >= 20) level = 'medium';
    else level = 'low';

    return {
      level,
      score: riskScore,
      factors,
      recommendations,
      requiresAdditionalAuth: riskScore >= 30,
      blockedActions: riskScore >= 60 ? ['transfer', 'settings'] : [],
    };
  }

  static recordLoginAttempt(username: string, success: boolean, behaviorData: BehaviorData, riskScore: number, failureReason?: string): void {
    const attempt: LoginAttempt = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      success,
      riskScore,
      behaviorData,
      ipAddress: behaviorData.ipAddress,
      userAgent: behaviorData.userAgent,
      failureReason,
    };

    const history = this.getLoginHistory(username);
    history.unshift(attempt);
    
    // Keep only recent history
    if (history.length > this.MAX_HISTORY) {
      history.splice(this.MAX_HISTORY);
    }

    localStorage.setItem(`${this.STORAGE_KEY}_${username}`, JSON.stringify(history));
  }

  static getLoginHistory(username: string): LoginAttempt[] {
    try {
      const stored = localStorage.getItem(`${this.STORAGE_KEY}_${username}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static clearLoginHistory(username: string): void {
    localStorage.removeItem(`${this.STORAGE_KEY}_${username}`);
  }

  static generateSecurityToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  static validateSecurityToken(token: string): boolean {
    return token.length === 64 && /^[a-f0-9]+$/.test(token);
  }
}