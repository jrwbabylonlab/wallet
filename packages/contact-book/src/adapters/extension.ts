import { StorageAdapter } from '../types';

// Declare extension APIs for environments where they might not be available
declare const chrome: any;
declare const browser: any;

/**
 * Extension storage adapter - compatible with Chrome Extension Storage API
 * Supports both chrome.storage.local and chrome.storage.sync
 */
export class ExtensionStorageAdapter implements StorageAdapter {
  private storage: any;

  constructor(storageType: 'local' | 'sync' = 'local') {
    // Support both Chrome extension and WebExtension APIs
    if (typeof chrome !== 'undefined' && chrome.storage) {
      this.storage = chrome.storage[storageType];
    } else if (typeof browser !== 'undefined' && browser.storage) {
      this.storage = browser.storage[storageType];
    } else {
      throw new Error('Extension storage API not available');
    }
  }

  async get(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.get([key], (result: Record<string, any>) => {
        if (chrome.runtime?.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(result[key]);
        }
      });
    });
  }

  async set(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.set({ [key]: value }, () => {
        if (chrome.runtime?.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  }

  async remove(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.remove([key], () => {
        if (chrome.runtime?.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  }

  async clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.clear(() => {
        if (chrome.runtime?.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  }
}