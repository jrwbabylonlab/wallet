/**
 * UniSat Wallet API Client - Fully compatible with openapi.ts interface
 *
 * This client provides a fully compatible interface with openapi.ts from unisat-extension
 */

// Export client
export { HttpClient } from './client/http-client'

// Export all services
export * from './services'

// Export all types
export * from './types'

// Export main client class
import { HttpClient } from './client/http-client'
import { BitcoinService } from './services/bitcoin'
import { InscriptionsService } from './services/inscriptions'
import { BRC20Service } from './services/brc20'
import { RunesService } from './services/runes'
import { AlkanesService } from './services/alkanes'
import type { CAT_VERSION, ClientConfig } from './types'
import { CATService, ConfigService, MarketService, UtilityService } from './services'
import { DomainService } from './services/domain'

/**
 * Unified API Client - Matches all methods from openapi.ts
 */
export class UniSatApiClient {
  public readonly bitcoin: BitcoinService
  public readonly inscriptions: InscriptionsService
  public readonly brc20: BRC20Service
  public readonly runes: RunesService
  public readonly alkanes: AlkanesService
  public readonly cat: CATService
  public readonly market: MarketService
  public readonly domain: DomainService
  public readonly utility: UtilityService
  public readonly config: ConfigService

  private readonly httpClient: HttpClient

  constructor(config: ClientConfig = {}) {
    this.httpClient = new HttpClient(config)

    // Initialize all services
    this.bitcoin = new BitcoinService(this.httpClient)
    this.inscriptions = new InscriptionsService(this.httpClient)
    this.brc20 = new BRC20Service(this.httpClient)
    this.runes = new RunesService(this.httpClient)
    this.alkanes = new AlkanesService(this.httpClient)
    this.cat = new CATService(this.httpClient)
    this.market = new MarketService(this.httpClient)
    this.domain = new DomainService(this.httpClient)
    this.utility = new UtilityService(this.httpClient)
    this.config = new ConfigService(this.httpClient)
  }

  // ========================================
  // HTTP Client configuration methods
  // ========================================

  /**
   * Set base URL
   */
  setBaseURL(baseURL: string): void {
    this.httpClient.setBaseURL(baseURL)
  }

  /**
   * Set request headers
   */
  setHeaders(headers: Record<string, string>): void {
    this.httpClient.setHeaders(headers)
  }

  /**
   * Remove request header
   */
  removeHeader(name: string): void {
    this.httpClient.removeHeader(name)
  }

  /**
   * Get underlying HTTP client
   */
  getHttpClient(): HttpClient {
    return this.httpClient
  }
}

/**
 * Convenient function to create UniSat API client
 */
export function createClient(config: ClientConfig = {}): UniSatApiClient {
  return new UniSatApiClient(config)
}
