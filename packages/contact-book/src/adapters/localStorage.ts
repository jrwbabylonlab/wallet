import { StorageAdapter } from '../types';

// Declare localStorage interface for environments where it might not be available
interface Storage {
  readonly length: number;
  clear(): void;
  getItem(key: string): string | null;
  key(index: number): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
}

declare const localStorage: Storage;

/**
 * LocalStorage adapter - stores data in browser's localStorage
 * Suitable for web applications and browser extensions
 */
export class LocalStorageAdapter implements StorageAdapter {
  constructor(private prefix: string = 'unisat_') {}

  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async get(key: string): Promise<any> {
    try {
      const fullKey = this.getFullKey(key);
      const value = localStorage.getItem(fullKey);
      return value ? JSON.parse(value) : undefined;
    } catch (error) {
      console.error('LocalStorageAdapter.get error:', error);
      return undefined;
    }
  }

  async set(key: string, value: any): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      localStorage.setItem(fullKey, JSON.stringify(value));
    } catch (error) {
      console.error('LocalStorageAdapter.set error:', error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error('LocalStorageAdapter.remove error:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('LocalStorageAdapter.clear error:', error);
      throw error;
    }
  }
}