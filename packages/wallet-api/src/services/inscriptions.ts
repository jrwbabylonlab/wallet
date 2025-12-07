/**
 * Inscriptions-related API methods - Fully compatible with openapi.ts
 */

import type { BaseHttpClient, HttpClient } from '../client/http-client'
import type {
  Inscription,
  InscriptionSummary,
  AppSummary,
  UTXO,
  UTXO_Detail,
  PaginationParams,
} from '../types'

export class InscriptionsService {
  constructor(private readonly httpClient: BaseHttpClient) {}

  // ========================================
  // Inscription UTXO related
  // ========================================

  /**
   * Get inscription UTXO
   */
  async getInscriptionUtxo(inscriptionId: string): Promise<UTXO> {
    return this.httpClient.get('/v5/inscription/utxo', {
      query: { inscriptionId },
    })
  }

  /**
   * Get inscription UTXO details
   */
  async getInscriptionUtxoDetail(inscriptionId: string): Promise<UTXO_Detail> {
    return this.httpClient.get('/v5/inscription/utxo-detail', {
      query: { inscriptionId },
    })
  }

  /**
   * Get UTXOs for multiple inscriptions
   */
  async getInscriptionUtxos(inscriptionIds: string[]): Promise<UTXO[]> {
    return this.httpClient.post('/v5/inscription/utxos', { inscriptionIds })
  }

  // ========================================
  // Inscription information related
  // ========================================

  /**
   * Get inscription information
   */
  async getInscriptionInfo(inscriptionId: string): Promise<Inscription> {
    return this.httpClient.get('/v5/inscription/info', {
      query: { inscriptionId },
    })
  }

  /**
   * Get address inscription list
   */
  async getAddressInscriptions(
    address: string,
    cursor: number,
    size: number
  ): Promise<{ list: Inscription[]; total: number }> {
    return this.httpClient.get('/v5/address/inscriptions', {
      query: { address, cursor, size },
    })
  }

  /**
   * Get inscription summary
   */
  async getInscriptionSummary(): Promise<InscriptionSummary> {
    return this.httpClient.get('/v5/default/inscription-summary')
  }

  /**
   * Get application summary
   */
  async getAppSummary(): Promise<AppSummary> {
    return this.httpClient.get('/v5/default/app-summary-v2')
  }

  // ========================================
  // Ordinals related
  // ========================================

  /**
   * Get Ordinals inscriptions
   */
  async getOrdinalsInscriptions(
    address: string,
    cursor: number,
    size: number
  ): Promise<{ list: Inscription[]; total: number }> {
    return this.httpClient.get('/v5/ordinals/inscriptions', {
      query: { address, cursor, size },
    })
  }
}
