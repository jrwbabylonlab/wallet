/**
 * Alkanes protocol related type definitions
 */

import type { Inscription } from './inscriptions';

// ========================================
// Alkanes types
// ========================================

export interface AlkanesBalance {
  amount: string;
  alkaneid: string;
  alkane: string;
  spacedAlkane: string;
  symbol: string;
  divisibility: number;
}

export interface AlkanesInfo {
  alkaneid: string;
  alkane: string;
  spacedAlkane: string;
  number: number;
  height: number;
  txidx: number;
  timestamp: number;
  divisibility: number;
  symbol: string;
  etching: string;
  premine: string;
  terms: {
    amount: string;
    cap: string;
    heightStart: number;
    heightEnd: number;
    offsetStart: number;
    offsetEnd: number;
  };
  mints: string;
  burned: string;
  holders: number;
  transactions: number;
  mintable: boolean;
  remaining: string;
  start: number;
  end: number;
  supply: string;
  parent?: string;
}

export interface AlkanesCollection {
  collectionId: string;
  name: string;
  symbol: string;
  count: number;
  previewLocalIds: string[];
}

export interface AddressAlkanesTokenSummary {
  alkanesInfo: AlkanesInfo;
  alkanesBalance: AlkanesBalance;
  alkanesLogo?: Inscription;
}