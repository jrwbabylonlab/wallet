import { StorageAdapter } from '../types';

/**
 * Extension persist store adapter - compatible with unisat-extension's createPersistStore
 * This adapter works with the existing createPersistStore utility from the extension
 */
export class ExtensionPersistStoreAdapter implements StorageAdapter {
  private createPersistStore: any;
  private store: any;
  private storageKey: string;
  
  constructor(createPersistStore: any, storageKey: string) {
    this.createPersistStore = createPersistStore;
    this.storageKey = storageKey;
  }

  async init(): Promise<void> {
    if (!this.store) {
      this.store = await this.createPersistStore({
        name: this.storageKey,
        template: {}
      });
    }
  }

  async get(key: string): Promise<any> {
    await this.init();
    
    if (key === this.storageKey) {
      // Return the entire store object for our storage key
      return this.store;
    }
    
    return this.store[key];
  }

  async set(key: string, value: any): Promise<void> {
    await this.init();
    
    if (key === this.storageKey) {
      // Replace the entire store content
      Object.keys(this.store).forEach(k => {
        delete this.store[k];
      });
      Object.assign(this.store, value);
    } else {
      this.store[key] = value;
    }
  }

  async remove(key: string): Promise<void> {
    await this.init();
    
    if (key === this.storageKey) {
      // Clear the entire store
      Object.keys(this.store).forEach(k => {
        delete this.store[k];
      });
    } else {
      delete this.store[key];
    }
  }

  async clear(): Promise<void> {
    await this.init();
    
    Object.keys(this.store).forEach(k => {
      delete this.store[k];
    });
  }
}