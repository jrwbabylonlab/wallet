/**
 * BRC20-related API methods - Fully compatible with openapi.ts
 */

import type { BaseHttpClient, HttpClient } from '../client/http-client'
import type {
  TokenBalance,
  TokenInfo,
  TokenTransfer,
  AddressTokenSummary,
  BRC20HistoryItem,
  TickPriceItem,
  InscribeOrder,
  PaginationParams,
  UserToSignInput,
} from '../types'

export class BRC20Service {
  constructor(private readonly httpClient: BaseHttpClient) {}

  // ========================================
  // BRC20 token list and balance
  // ========================================

  /**
   * Get address BRC20 token list
   */
  async getBRC20List(
    address: string,
    cursor: number,
    size: number
  ): Promise<{ list: TokenBalance[]; total: number }> {
    return this.httpClient.get('/v5/brc20/list', {
      query: { address, cursor, size },
    })
  }

  /**
   * Get address specific token summary
   */
  async getAddressTokenSummary(address: string, ticker: string): Promise<AddressTokenSummary> {
    return this.httpClient.get(
      `/v5/brc20/token-summary?address=${address}&ticker=${encodeURIComponent(ticker)}`
    )
  }

  // ========================================
  // BRC20 token history
  // ========================================

  /**
   * Get address token history list
   */
  async getAddressTokenHistoryList(
    address: string,
    ticker: string,
    cursor: number,
    size: number
  ): Promise<{ list: TokenTransfer[]; total: number }> {
    return this.httpClient.get('/v5/address/brc20-history', {
      query: {
        address,
        ticker: encodeURIComponent(ticker),
        cursor,
        size,
      },
    })
  }

  /**
   * Get BRC20 recent history
   */
  async getBRC20RecentHistory(address: string, ticker: string): Promise<BRC20HistoryItem[]> {
    return this.httpClient.get('/v5/brc20/recent-history', {
      query: { address, ticker },
    })
  }

  // ========================================
  // BRC20 price related
  // ========================================

  /**
   * Get token price
   */
  async getTickPrice(ticker: string): Promise<TickPriceItem> {
    return this.httpClient.get('/v5/tick/price', {
      query: { tick: ticker },
    })
  }

  // ========================================
  // BRC20 transfer related
  // ========================================

  /**
   * Inscribe BRC20 transfer
   */
  async inscribeBRC20Transfer(
    address: string,
    tick: string,
    amount: string,
    feeRate: number,
    outputValue?: number
  ): Promise<InscribeOrder> {
    return this.httpClient.post('/v5/brc20/inscribe-transfer', {
      address,
      tick,
      amount,
      feeRate,
      outputValue,
    })
  }

  /**
   * Get inscription result
   */
  async getInscribeResult(orderId: string): Promise<TokenTransfer> {
    return this.httpClient.get('/v5/brc20/order-result', {
      query: { orderId },
    })
  }

  async getTokenTransferableList(
    address: string,
    ticker: string,
    cursor: number,
    size: number
  ): Promise<{ list: TokenTransfer[]; total: number }> {
    return this.httpClient.get('/v5/brc20/transferable-list', {
      query: {
        address,
        ticker: encodeURIComponent(ticker),
        cursor,
        size,
      },
    })
  }
  // ========================================
  // Single step transfer related
  // ========================================

  /**
   * Single step transfer BRC20 - Step 1
   */
  async singleStepTransferBRC20Step1({
    userAddress,
    userPubkey,
    receiver,
    ticker,
    amount,
    feeRate,
  }: {
    userAddress: string
    userPubkey: string
    receiver: string
    ticker: string
    amount: string
    feeRate: number
  }): Promise<{
    orderId: string
    psbtHex: string
    toSignInputs: UserToSignInput[]
  }> {
    return this.httpClient.post('/v5/brc20/single-step-transfer/request-commit', {
      userAddress,
      userPubkey,
      receiver,
      ticker,
      amount,
      feeRate,
    })
  }

  async singleStepTransferBRC20Step2({
    orderId,
    psbt,
  }: {
    orderId: string
    psbt: string
  }): Promise<{
    psbtHex: string
    toSignInputs: UserToSignInput[]
  }> {
    return this.httpClient.post('/v5/brc20/single-step-transfer/sign-commit', {
      orderId,
      psbt,
    })
  }
  /**
   * Single step transfer BRC20 - Step 3
   */
  async singleStepTransferBRC20Step3(params: { orderId: string; psbt: string }): Promise<{
    txid: string
  }> {
    return this.httpClient.post('/v5/brc20/single-step-transfer/sign-reveal', params)
  }

  async getBRC20ProgList(
    address: string,
    cursor: number,
    size: number
  ): Promise<{ list: TokenBalance[]; total: number }> {
    return this.httpClient.get('/v5/brc20-prog/list', { query: { address, cursor, size, type: 5 } })
  }
}
