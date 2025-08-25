import type { StorageAdapter } from '../types';

/**
 * Extension persist store adapter - integrates with existing createPersistStore utility
 * Compatible with the extension's storage system
 */
export class ExtensionPersistStoreAdapter implements StorageAdapter {
  private createPersistStore: any;
  private store: any;
  private storageKey: string;
  private isInitialized: boolean = false;

  constructor(createPersistStore: any, storageKey: string) {
    this.createPersistStore = createPersistStore;
    this.storageKey = storageKey;
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.init();
    }
  }

  async init(): Promise<void> {
    if (!this.store) {
      // Provide a proper template for permission service
      const template = { dumpCache: [] };
      
      this.store = await this.createPersistStore({
        name: this.storageKey,
        template: template,
        fromStorage: true
      });
      this.isInitialized = true;
    }
  }

  async get(key: string): Promise<any> {
    await this.ensureInitialized();
    
    // For permission service, the storage key should return the entire store
    // This matches how the original permission service worked with createPersistStore
    if (key === this.storageKey) {
      return this.store;
    }
    
    // For other keys, access as properties of the store
    return this.store[key];
  }

  async set(key: string, value: any): Promise<void> {
    await this.ensureInitialized();
    
    if (key === this.storageKey) {
      // For permission service, update the store properties
      // This matches how the original sync() method worked
      if (value && typeof value === 'object') {
        Object.keys(this.store).forEach(k => delete this.store[k]);
        Object.assign(this.store, value);
      }
    } else {
      // Set specific property
      this.store[key] = value;
    }
  }

  async remove(key: string): Promise<void> {
    await this.ensureInitialized();
    delete this.store[key];
  }

  async clear(): Promise<void> {
    await this.ensureInitialized();
    Object.keys(this.store).forEach(key => delete this.store[key]);
  }
}