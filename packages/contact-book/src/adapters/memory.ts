import { StorageAdapter } from '../types';

/**
 * Memory storage adapter - stores data in memory (non-persistent)
 * Useful for testing or temporary storage scenarios
 */
export class MemoryStorageAdapter implements StorageAdapter {
  private data = new Map<string, any>();

  async get(key: string): Promise<any> {
    return this.data.get(key);
  }

  async set(key: string, value: any): Promise<void> {
    this.data.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.data.delete(key);
  }

  async clear(): Promise<void> {
    this.data.clear();
  }
}