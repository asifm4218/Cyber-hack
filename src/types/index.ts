export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  profileImage?: string;
  accountNumber: string;
  phoneNumber: string;
  address: string;
  joinDate: string;
  lastLogin: string;
  securityLevel: 'basic' | 'enhanced' | 'premium';
}

export interface Account {
  id: string;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  availableBalance: number;
  currency: string;
  status: 'active' | 'frozen' | 'closed';
  openDate: string;
  interestRate?: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  category: string;
  date: string;
  balance: number;
  merchant?: string;
  location?: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

export interface BehaviorData {
  loginTime: string;
  deviceFingerprint: string;
  ipAddress: string;
  location: string;
  userAgent: string;
  screenResolution: string;
  timeZone: string;
  loginDuration: number;
  mouseMovements: number;
  keyboardPattern: string;
  browserLanguage: string;
  // BBCA Enhanced Behavior Metrics
  typingSpeed: number;
  tapPressure: number[];
  swipeGestures: SwipeGesture[];
  deviceOrientation: DeviceOrientation;
  scrollPattern: ScrollPattern;
  clickPattern: ClickPattern;
  sessionDuration: number;
  appUsagePattern: AppUsagePattern;
}

export interface SwipeGesture {
  direction: 'up' | 'down' | 'left' | 'right';
  velocity: number;
  distance: number;
  timestamp: number;
}

export interface DeviceOrientation {
  alpha: number;
  beta: number;
  gamma: number;
  timestamp: number;
}

export interface ScrollPattern {
  speed: number;
  direction: 'up' | 'down';
  frequency: number;
  timestamp: number;
}

export interface ClickPattern {
  x: number;
  y: number;
  pressure: number;
  duration: number;
  timestamp: number;
}

export interface AppUsagePattern {
  screenTime: number;
  featuresUsed: string[];
  navigationPattern: string[];
  transactionFrequency: number;
}

export interface RiskAssessment {
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  factors: string[];
  recommendations: string[];
  requiresAdditionalAuth: boolean;
  blockedActions: string[];
  confidence: number;
  anomalyDetected: boolean;
  behaviorScore: number;
}

export interface LoginAttempt {
  id: string;
  timestamp: string;
  success: boolean;
  riskScore: number;
  behaviorData: BehaviorData;
  ipAddress: string;
  userAgent: string;
  failureReason?: string;
  behaviorAnomalies: string[];
}

export interface SecurityEvent {
  id: string;
  type: 'login' | 'transfer' | 'settings_change' | 'suspicious_activity' | 'behavior_anomaly';
  timestamp: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  behaviorData?: Partial<BehaviorData>;
}

export interface TransferRequest {
  fromAccount: string;
  toAccount: string;
  amount: number;
  description: string;
  transferType: 'internal' | 'external' | 'wire';
  scheduledDate?: string;
}

export interface BBCAConfig {
  enabled: boolean;
  sensitivity: 'low' | 'medium' | 'high';
  monitoringInterval: number;
  anomalyThreshold: number;
  reAuthThreshold: number;
  sessionTimeoutOnAnomaly: number;
  privacyMode: boolean;
  gdprCompliant: boolean;
}

export interface BehaviorModel {
  userId: string;
  typingSpeedBaseline: number;
  tapPressureBaseline: number[];
  swipeVelocityBaseline: number;
  scrollSpeedBaseline: number;
  clickPatternBaseline: ClickPattern[];
  sessionDurationBaseline: number;
  lastUpdated: string;
  confidence: number;
}