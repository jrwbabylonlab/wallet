/**
 * Background Manager - Unified service management for wallet background
 */

import { EventEmitter } from 'eventemitter3';
import type { 
  StorageAdapter, 
  NotificationAdapter, 
  NetworkAdapter, 
  PlatformAdapter 
} from './adapters';

export interface BackgroundManagerConfig {
  storage: StorageAdapter;
  notification: NotificationAdapter;
  network: NetworkAdapter;
  platform: PlatformAdapter;
}

export interface BackgroundManagerEvents {
  'service:ready': (serviceName: string) => void;
  'service:error': (serviceName: string, error: Error) => void;
  'manager:ready': () => void;
  'manager:error': (error: Error) => void;
}

export class BackgroundManager extends EventEmitter<BackgroundManagerEvents> {
  private adapters: BackgroundManagerConfig;
  private services: Map<string, any> = new Map();
  private initialized = false;

  constructor(config: BackgroundManagerConfig) {
    super();
    this.adapters = config;
  }

  /**
   * Initialize all background services
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Initialize core services in dependency order
      await this.initializeServices();
      
      this.initialized = true;
      this.emit('manager:ready');
    } catch (error) {
      this.emit('manager:error', error as Error);
      throw error;
    }
  }

  /**
   * Get service instance by name
   */
  getService<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    return service;
  }

  /**
   * Check if manager is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get all adapters
   */
  getAdapters(): BackgroundManagerConfig {
    return this.adapters;
  }

  /**
   * Cleanup all services
   */
  async cleanup(): Promise<void> {
    for (const [name, service] of this.services.entries()) {
      try {
        if (typeof service.cleanup === 'function') {
          await service.cleanup();
        }
      } catch (error) {
        console.error(`Error cleaning up service ${name}:`, error);
      }
    }
    
    this.services.clear();
    this.initialized = false;
  }

  private async initializeServices(): Promise<void> {
    // TODO: Initialize services in correct order
    // This will be implemented when migrating actual services
    
    // Example service initialization:
    // const walletController = new WalletController(this.adapters);
    // await walletController.initialize();
    // this.services.set('wallet', walletController);
    // this.emit('service:ready', 'wallet');
  }
}