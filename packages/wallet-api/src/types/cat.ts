/**
 * CAT20/CAT721 protocol related type definitions
 */

// ========================================
// CAT20/CAT721 types
// ========================================

export interface CAT20Balance {
  tokenId: string;
  amount: string;
  name: string;
  symbol: string;
  decimals: number;
}

export interface CAT20TokenInfo {
  tokenId: string;
  name: string;
  symbol: string;
  max: string;
  premine: string;
  limit: number;
}

export interface AddressCAT20TokenSummary {
  cat20Info: CAT20TokenInfo;
  cat20Balance: CAT20Balance;
}

export interface AddressCAT20UtxoSummary {
  availableTokenAmounts: string[];
  availableUtxoCount: number;
  totalUtxoCount: number;
}

export interface CAT721CollectionInfo {
  collectionId: string;
  name: string;
  symbol: string;
  max: string;
  premine: string;
  description: string;
  contentType: string;
}

export interface AddressCAT721CollectionSummary {
  collectionInfo: CAT721CollectionInfo;
  localIds: string[];
}