/**
 * 监控和错误追踪工具
 * 轻量级实现，可替换为 Sentry 等第三方服务
 */

interface ErrorEvent {
  type: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  userId?: string;
  metadata?: Record<string, any>;
}

class MonitoringService {
  private enabled: boolean;
  private endpoint?: string;
  private userId?: string;

  constructor() {
    this.enabled = process.env.NODE_ENV === 'production';
    this.endpoint = process.env.NEXT_PUBLIC_MONITORING_ENDPOINT;
    
    if (typeof window !== 'undefined') {
      this.setupGlobalHandlers();
    }
  }

  private setupGlobalHandlers(): void {
    // 全局错误捕获
    window.addEventListener('error', (event) => {
      this.captureError(event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // 未处理的 Promise 错误
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(event.reason, { type: 'unhandledrejection' });
    });
  }

  setUser(userId: string): void {
    this.userId = userId;
  }

  captureError(error: Error | string, metadata?: Record<string, any>): void {
    const event: ErrorEvent = {
      type: 'error',
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: new Date().toISOString(),
      userId: this.userId,
      metadata
    };

    this.sendEvent(event);
    
    // 开发环境也打印到控制台
    if (process.env.NODE_ENV === 'development') {
      console.error('[Monitoring]', event);
    }
  }

  captureMessage(message: string, level: 'info' | 'warning' = 'info'): void {
    const event: ErrorEvent = {
      type: level,
      message,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: new Date().toISOString(),
      userId: this.userId
    };

    this.sendEvent(event);
  }

  private sendEvent(event: ErrorEvent): void {
    // 发送到监控端点
    if (this.endpoint && this.enabled) {
      fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
        keepalive: true
      }).catch(() => {
        // 发送失败不阻塞
      });
    }

    // 同时存储到本地（用于调试）
    this.storeLocally(event);
  }

  private storeLocally(event: ErrorEvent): void {
    try {
      const key = 'ai-nav-errors';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(event);
      
      // 只保留最近 50 条
      if (existing.length > 50) {
        existing.shift();
      }
      
      localStorage.setItem(key, JSON.stringify(existing));
    } catch {
      // 忽略存储错误
    }
  }

  // 性能监控
  trackPerformance(metric: string, value: number, tags?: Record<string, string>): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${metric}: ${value}`, tags);
    }

    // 发送到分析端点
    if (this.enabled) {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'performance',
          metric,
          value,
          tags,
          timestamp: new Date().toISOString()
        }),
        keepalive: true
      }).catch(() => {});
    }
  }
}

export const monitoring = new MonitoringService();

// 便捷导出
export const captureError = (error: Error | string, metadata?: Record<string, any>) => 
  monitoring.captureError(error, metadata);

export const captureMessage = (message: string, level?: 'info' | 'warning') => 
  monitoring.captureMessage(message, level);

export const setUser = (userId: string) => monitoring.setUser(userId);

export const trackPerformance = (metric: string, value: number, tags?: Record<string, string>) => 
  monitoring.trackPerformance(metric, value, tags);
