/**
 * Market and pricing related API methods
 */

import type { HttpClient } from '../client/http-client'
import type { CoinPrice, FeeSummary, TickPriceItem } from '../types'

export class MarketService {
  constructor(private readonly httpClient: HttpClient) {}

  // ========================================
  // Price related
  // ========================================

  /**
   * Get coin price
   */
  async getCoinPrice(): Promise<CoinPrice> {
    return this.httpClient.get('/v5/default/price')
  }

  /**
   * Get fee summary
   */
  async getFeeSummary(): Promise<FeeSummary> {
    return this.httpClient.get('/v5/default/fee-summary')
  }

  async getBrc20sPrice(ticks: string[]): Promise<TickPriceItem> {
    return this.httpClient.post('/v5/market/brc20/price', { ticks })
  }

  async getRunesPrice(ticks: string[]): Promise<TickPriceItem> {
    return this.httpClient.post('/v5/market/runes/price', { ticks })
  }

  async getCAT20sPrice(ticks: string[]): Promise<TickPriceItem> {
    return this.httpClient.post('/v5/market/cat20/price', { ticks })
  }

  async getAlkanesPrice(ticks: string[]): Promise<TickPriceItem> {
    return this.httpClient.post('/v5/market/alkanes/price', { ticks })
  }
}
