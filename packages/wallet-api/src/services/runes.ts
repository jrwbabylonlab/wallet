/**
 * Runes-related API methods - Fully compatible with openapi.ts
 */

import type { BaseHttpClient, HttpClient } from '../client/http-client'
import type { RuneBalance, AddressRunesTokenSummary, UTXO } from '../types'

export class RunesService {
  constructor(private readonly httpClient: BaseHttpClient) {}

  // ========================================
  // Runes related
  // ========================================

  /**
   * Get address Runes list
   */
  async getRunesList(
    address: string,
    cursor: number,
    size: number
  ): Promise<{ list: RuneBalance[]; total: number }> {
    return this.httpClient.get('/v5/runes/list', {
      query: { address, cursor, size },
    })
  }

  /**
   * Get Runes UTXO
   */
  async getRunesUtxos(address: string, runeid: string): Promise<UTXO[]> {
    return this.httpClient.get('/v5/runes/utxos', {
      query: { address, runeid },
    })
  }

  /**
   * Get address Runes token summary
   */
  async getAddressRunesTokenSummary(
    address: string,
    runeid: string
  ): Promise<AddressRunesTokenSummary> {
    return this.httpClient.get(`/v5/runes/token-summary?address=${address}&runeid=${runeid}`)
  }
}
