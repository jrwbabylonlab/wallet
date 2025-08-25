import { StorageAdapter } from '../types';

// Chrome Extension API types
declare global {
  namespace chrome {
    namespace storage {
      interface StorageArea {
        get(keys?: string | string[] | Record<string, any>): Promise<Record<string, any>>;
        set(items: Record<string, any>): Promise<void>;
      }
      const local: StorageArea;
    }
  }
}

export class LocalStorageAdapter implements StorageAdapter {
  getItem(key: string): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  }

  setItem(key: string, value: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  }
}

export class ChromeStorageAdapter implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const result = await chrome.storage.local.get(key);
      return result[key] || null;
    }
    return null;
  }

  async setItem(key: string, value: string): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ [key]: value });
    }
  }
}

export class MemoryStorageAdapter implements StorageAdapter {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}