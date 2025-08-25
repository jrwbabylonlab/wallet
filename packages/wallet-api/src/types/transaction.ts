/**
 * Transaction and PSBT related type definitions
 */

import type { Inscription } from './inscriptions'
import type { RuneBalance } from './runes'
import type { AlkanesBalance } from './alkanes'

// ========================================
// Transaction and PSBT related
// ========================================

export interface DecodedPsbt {
  inputInfos: {
    txid: string
    vout: number
    address: string
    value: number
    inscriptions: Inscription[]
    sighashType: number
    runes: RuneBalance[]
    alkanes: AlkanesBalance[]
    contract?: any
  }[]
  outputInfos: {
    address: string
    value: number
    inscriptions: Inscription[]
    runes: RuneBalance[]
    alkanes: AlkanesBalance[]
    contract?: any
  }[]
  inscriptions: { [key: string]: Inscription }
  feeRate: number
  fee: number
  features: {
    rbf: boolean
  }
  risks: any[]
  psbtHex: string
  rawtx: string
  toAddress: string
  estimateFee: number
}
