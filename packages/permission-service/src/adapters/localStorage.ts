import type { StorageAdapter } from '../types';

// Declare localStorage interface for environments that might not have it
declare global {
  interface Storage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
    clear(): void;
  }
}

/**
 * LocalStorage adapter - uses browser localStorage
 * Works in browser environments
 */
export class LocalStorageAdapter implements StorageAdapter {
  private storage: Storage;

  constructor() {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      throw new Error('localStorage is not available in this environment');
    }
    this.storage = window.localStorage;
  }

  async get(key: string): Promise<any> {
    try {
      const item = this.storage.getItem(key);
      return item ? JSON.parse(item) : undefined;
    } catch (error) {
      console.error('LocalStorageAdapter: Failed to get item', key, error);
      return undefined;
    }
  }

  async set(key: string, value: any): Promise<void> {
    try {
      this.storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('LocalStorageAdapter: Failed to set item', key, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error('LocalStorageAdapter: Failed to remove item', key, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      this.storage.clear();
    } catch (error) {
      console.error('LocalStorageAdapter: Failed to clear storage', error);
      throw error;
    }
  }
}