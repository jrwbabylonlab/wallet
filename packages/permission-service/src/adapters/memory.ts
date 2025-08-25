import type { StorageAdapter } from '../types'

/**
 * Memory storage adapter - stores data in memory only
 * Useful for testing or non-persistent scenarios
 */
export class MemoryStorageAdapter implements StorageAdapter {
  private data: Map<string, any> = new Map()

  async get(key: string): Promise<any> {
    return this.data.get(key)
  }

  async set(key: string, value: any): Promise<void> {
    this.data.set(key, value)
  }

  async remove(key: string): Promise<void> {
    this.data.delete(key)
  }

  async clear(): Promise<void> {
    this.data.clear()
  }
}
