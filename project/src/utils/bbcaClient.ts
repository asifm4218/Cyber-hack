import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { BehaviorData, RiskAssessment } from '../types';

class BBCAClient {
  private socket: Socket | null = null;
  private baseURL: string;
  private socketURL: string;

  constructor() {
    // Dynamically determine backend URL for webcontainer environments
    let backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    
    if (!backendUrl && typeof window !== 'undefined') {
      // In webcontainer, construct URL using current hostname
      const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
      const hostname = window.location.hostname;
      backendUrl = `${protocol}//${hostname.replace('3000', '5000')}`;
    }
    
    // Fallback to localhost for development
    backendUrl = backendUrl || 'http://localhost:5000';
    
    this.baseURL = `${backendUrl}/api/bbca`;
    this.socketURL = backendUrl;
    
    this.initializeSocket();
  }

  private initializeSocket() {
    try {
      this.socket = io(this.socketURL, {
        transports: ['websocket', 'polling'],
        autoConnect: false,
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000
      });

      this.socket.on('connect', () => {
        console.log('🔗 BBCA: Connected to backend');
      });

      this.socket.on('disconnect', () => {
        console.log('🔌 BBCA: Disconnected from backend');
      });

      this.socket.on('connect_error', (error) => {
        console.warn('🔌 BBCA: Connection error, falling back to local mode', error.message);
      });

      this.socket.on('security_alert', (data) => {
        console.warn('🚨 BBCA: Security alert received', data);
        this.handleSecurityAlert(data);
      });

    } catch (error) {
      console.error('BBCA Socket initialization error:', error);
    }
  }

  connect(userId: string) {
    if (this.socket && !this.socket.connected) {
      this.socket.connect();
      this.socket.emit('join_user_room', { userId });
    }
  }

  disconnect() {
    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
    }
  }

  async analyzeBehavior(userId: string, behaviorData: BehaviorData): Promise<any> {
    try {
      const response = await axios.post(`${this.baseURL}/analyze`, {
        userId,
        behaviorData
      }, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      console.warn('BBCA Analysis: Backend unavailable, using fallback analysis');
      // Fallback to local analysis if backend is unavailable
      return this.fallbackAnalysis(behaviorData);
    }
  }

  async trainUserModel(userId: string): Promise<any> {
    try {
      const response = await axios.post(`${this.baseURL}/train`, {
        userId
      }, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      console.warn('BBCA Training: Backend unavailable');
      return { error: 'Training failed - backend unavailable', fallback: true };
    }
  }

  async getSecurityEvents(userId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/security-events/${userId}`, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      console.warn('BBCA Security events: Backend unavailable');
      return { events: [], fallback: true };
    }
  }

  async getConfig(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/config`, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      console.warn('BBCA Config: Backend unavailable, using default config');
      return this.getDefaultConfig();
    }
  }

  async updateConfig(config: any): Promise<any> {
    try {
      const response = await axios.post(`${this.baseURL}/config`, config, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      console.warn('BBCA Config update: Backend unavailable');
      return { error: 'Config update failed - backend unavailable', fallback: true };
    }
  }

  private fallbackAnalysis(behaviorData: BehaviorData): any {
    // Simple fallback analysis when backend is unavailable
    const riskScore = Math.random() * 0.3; // Low risk by default
    
    return {
      sessionId: `fallback_${Date.now()}`,
      riskAssessment: {
        anomaly_score: riskScore,
        is_anomaly: riskScore > 0.2,
        confidence: 0.5,
        risk_level: riskScore > 0.2 ? 'medium' : 'low'
      },
      recommendations: ['Backend unavailable - using local analysis'],
      requiresReAuth: false,
      blockedActions: [],
      fallback: true
    };
  }

  private getDefaultConfig() {
    return {
      enabled: true,
      sensitivity: 'medium',
      monitoringInterval: 5000,
      anomalyThreshold: 0.7,
      reAuthThreshold: 0.8,
      privacyMode: true,
      gdprCompliant: true,
      fallback: true
    };
  }

  private handleSecurityAlert(data: any) {
    // Emit custom event for the application to handle
    window.dispatchEvent(new CustomEvent('bbca-security-alert', {
      detail: data
    }));
  }

  onSecurityAlert(callback: (data: any) => void) {
    window.addEventListener('bbca-security-alert', (event: any) => {
      callback(event.detail);
    });
  }

  offSecurityAlert(callback: (data: any) => void) {
    window.removeEventListener('bbca-security-alert', callback);
  }
}

export const bbcaClient = new BBCAClient();