/**
 * Phishing Controller - 钓鱼网站检测控制器包装器
 * 
 * 这个控制器是 @unisat/phishing-service 的包装器，
 * 提供与 wallet-background 架构的集成
 */

import { BaseController } from './base';
import type { BackgroundManagerConfig } from '../background-manager';

export interface PhishingControllerEvents {
  'phishing:detected': (hostname: string, reason: string) => void;
  'phishing:updated': (config: any) => void;
  'phishing:blocked': (hostname: string, url: string) => void;
}

/**
 * Phishing 控制器 - 使用独立的 phishing-service 包
 * 
 * 注意：实际的钓鱼检测逻辑已经移到 @unisat/phishing-service 包中
 * 这个控制器主要负责：
 * 1. 与平台适配器集成
 * 2. 处理通知和警告页面跳转
 * 3. 提供统一的事件接口
 */
export class PhishingController extends BaseController {
  declare emit: <K extends keyof PhishingControllerEvents>(event: K, ...args: Parameters<PhishingControllerEvents[K]>) => boolean;

  private phishingService: any = null; // 将在运行时注入实际的 PhishingService

  constructor(adapters: BackgroundManagerConfig) {
    super(adapters);
  }

  protected async onInitialize(): Promise<void> {
    // 注意：实际的 PhishingService 实例需要在运行时注入
    // 这样设计是为了避免在 wallet-background 包中直接依赖 phishing-service
    console.log('PhishingController initialized - phishing service should be injected separately');
  }

  protected async onCleanup(): Promise<void> {
    if (this.phishingService) {
      this.phishingService.destroy();
    }
  }

  /**
   * 注入 PhishingService 实例
   */
  setPhishingService(service: any): void {
    this.phishingService = service;
    
    // 转发事件
    if (service) {
      service.on('phishing:detected', (hostname: string, reason: string) => {
        this.emit('phishing:detected', hostname, reason);
      });
      
      service.on('phishing:updated', (config: any) => {
        this.emit('phishing:updated', config);
      });
    }
  }

  /**
   * 检查域名是否为钓鱼网站
   */
  checkPhishing(hostname: string): any {
    if (!this.phishingService) {
      console.warn('PhishingService not injected');
      return { isPhishing: false, reason: 'Service not available' };
    }
    
    return this.phishingService.checkPhishing(hostname);
  }

  /**
   * 简化的布尔检查
   */
  isPhishing(hostname: string): boolean {
    const result = this.checkPhishing(hostname);
    return result.isPhishing;
  }

  /**
   * 添加到白名单
   */
  addToWhitelist(hostname: string): void {
    if (this.phishingService) {
      this.phishingService.addToWhitelist(hostname);
    }
  }

  /**
   * 强制更新
   */
  async forceUpdate(): Promise<void> {
    if (this.phishingService) {
      await this.phishingService.forceUpdate();
    }
  }

  /**
   * 获取配置
   */
  getConfig(): any {
    if (!this.phishingService) {
      return null;
    }
    return this.phishingService.getConfig();
  }

  /**
   * 获取统计信息
   */
  getStats(): any {
    if (!this.phishingService) {
      return null;
    }
    return this.phishingService.getStats();
  }

  /**
   * 阻止访问钓鱼网站
   */
  async blockPhishingSite(hostname: string, url: string): Promise<void> {
    this.emit('phishing:blocked', hostname, url);
    
    // 使用平台适配器发送通知
    if (this.adapters.notification.isSupported()) {
      await this.adapters.notification.create('phishing-blocked', {
        title: '钓鱼网站已阻止',
        message: `检测到钓鱼网站: ${hostname}`,
        type: 'basic'
      });
    }

    // 记录到平台日志
    this.adapters.platform.log('warn', `Blocked phishing site: ${hostname}`, { url });
  }
}

export default PhishingController;
