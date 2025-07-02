/**
 * Mobile Device Detection and Sensor Access Utilities
 * Optimized for mobile banking security
 */

export class MobileDetection {
  static isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  static isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  static isAndroid(): boolean {
    return /Android/.test(navigator.userAgent);
  }

  static getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const userAgent = navigator.userAgent;
    
    if (/tablet|ipad/i.test(userAgent)) {
      return 'tablet';
    } else if (this.isMobile()) {
      return 'mobile';
    } else {
      return 'desktop';
    }
  }

  static async requestPermissions(): Promise<{
    motion: boolean;
    orientation: boolean;
    touch: boolean;
  }> {
    const permissions = {
      motion: false,
      orientation: false,
      touch: 'ontouchstart' in window
    };

    try {
      // Request device motion permission (iOS 13+)
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        const motionPermission = await (DeviceMotionEvent as any).requestPermission();
        permissions.motion = motionPermission === 'granted';
      } else {
        permissions.motion = 'DeviceMotionEvent' in window;
      }

      // Request device orientation permission (iOS 13+)
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const orientationPermission = await (DeviceOrientationEvent as any).requestPermission();
        permissions.orientation = orientationPermission === 'granted';
      } else {
        permissions.orientation = 'DeviceOrientationEvent' in window;
      }
    } catch (error) {
      console.warn('Permission request failed:', error);
    }

    return permissions;
  }
}

export class MobileSensors {
  private motionCallback: ((data: any) => void) | null = null;
  private orientationCallback: ((data: any) => void) | null = null;
  private touchCallback: ((data: any) => void) | null = null;

  async initialize(): Promise<boolean> {
    if (!MobileDetection.isMobile()) {
      console.warn('Mobile sensors not available on desktop');
      return false;
    }

    const permissions = await MobileDetection.requestPermissions();
    return permissions.motion || permissions.orientation || permissions.touch;
  }

  startMotionTracking(callback: (data: any) => void) {
    this.motionCallback = callback;
    
    const handleMotion = (event: DeviceMotionEvent) => {
      const data = {
        acceleration: {
          x: event.acceleration?.x || 0,
          y: event.acceleration?.y || 0,
          z: event.acceleration?.z || 0
        },
        accelerationIncludingGravity: {
          x: event.accelerationIncludingGravity?.x || 0,
          y: event.accelerationIncludingGravity?.y || 0,
          z: event.accelerationIncludingGravity?.z || 0
        },
        rotationRate: {
          alpha: event.rotationRate?.alpha || 0,
          beta: event.rotationRate?.beta || 0,
          gamma: event.rotationRate?.gamma || 0
        },
        interval: event.interval,
        timestamp: Date.now()
      };
      
      callback(data);
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }

  startOrientationTracking(callback: (data: any) => void) {
    this.orientationCallback = callback;
    
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const data = {
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0,
        absolute: event.absolute,
        timestamp: Date.now()
      };
      
      callback(data);
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }

  startTouchTracking(callback: (data: any) => void) {
    this.touchCallback = callback;
    
    const handleTouchStart = (event: TouchEvent) => {
      const touches = Array.from(event.touches).map(touch => ({
        identifier: touch.identifier,
        clientX: touch.clientX,
        clientY: touch.clientY,
        force: touch.force || 0,
        radiusX: touch.radiusX || 0,
        radiusY: touch.radiusY || 0,
        rotationAngle: touch.rotationAngle || 0,
        timestamp: Date.now()
      }));
      
      callback({
        type: 'touchstart',
        touches,
        timestamp: Date.now()
      });
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touches = Array.from(event.touches).map(touch => ({
        identifier: touch.identifier,
        clientX: touch.clientX,
        clientY: touch.clientY,
        force: touch.force || 0,
        timestamp: Date.now()
      }));
      
      callback({
        type: 'touchmove',
        touches,
        timestamp: Date.now()
      });
    };

    const handleTouchEnd = (event: TouchEvent) => {
      callback({
        type: 'touchend',
        changedTouches: Array.from(event.changedTouches).map(touch => ({
          identifier: touch.identifier,
          clientX: touch.clientX,
          clientY: touch.clientY,
          timestamp: Date.now()
        })),
        timestamp: Date.now()
      });
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }

  stopAllTracking() {
    // Cleanup will be handled by the returned functions from start methods
    this.motionCallback = null;
    this.orientationCallback = null;
    this.touchCallback = null;
  }
}

export class BatteryOptimization {
  private static instance: BatteryOptimization;
  private isLowPowerMode = false;
  private batteryLevel = 1.0;

  static getInstance(): BatteryOptimization {
    if (!BatteryOptimization.instance) {
      BatteryOptimization.instance = new BatteryOptimization();
    }
    return BatteryOptimization.instance;
  }

  async initialize() {
    try {
      // @ts-ignore - Battery API is experimental
      const battery = await navigator.getBattery?.();
      
      if (battery) {
        this.batteryLevel = battery.level;
        this.isLowPowerMode = battery.level < 0.2;

        battery.addEventListener('levelchange', () => {
          this.batteryLevel = battery.level;
          this.isLowPowerMode = battery.level < 0.2;
          this.adjustPerformance();
        });
      }
    } catch (error) {
      console.warn('Battery API not available:', error);
    }
  }

  private adjustPerformance() {
    if (this.isLowPowerMode) {
      // Reduce monitoring frequency
      window.dispatchEvent(new CustomEvent('bbca-low-power-mode', {
        detail: { enabled: true, batteryLevel: this.batteryLevel }
      }));
    }
  }

  isLowPower(): boolean {
    return this.isLowPowerMode;
  }

  getBatteryLevel(): number {
    return this.batteryLevel;
  }

  getOptimalMonitoringInterval(): number {
    if (this.isLowPowerMode) {
      return 10000; // 10 seconds in low power mode
    } else if (this.batteryLevel < 0.5) {
      return 7000; // 7 seconds for medium battery
    } else {
      return 5000; // 5 seconds for good battery
    }
  }
}