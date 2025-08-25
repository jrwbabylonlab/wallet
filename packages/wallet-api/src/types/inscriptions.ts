/**
 * Inscriptions related type definitions
 */

// ========================================
// Inscriptions types
// ========================================

export interface Inscription {
  inscriptionId: string;
  inscriptionNumber: number;
  address: string;
  outputValue: number;
  preview: string;
  content: string;
  contentType: string;
  contentLength: number;
  timestamp: number;
  genesisTransaction: string;
  location: string;
  output: string;
  offset: number;
  contentBody: string;
  utxoHeight: number;
  utxoConfirmation: number;
  brc20?: {
    op: string;
    tick: string;
    lim: string;
    amt: string;
    decimal: string;
  };
  multipleNFT?: boolean;
  sameOffset?: boolean;
  children?: string[];
  parents?: string[];
}

export interface InscriptionSummary {
  mintedList: {
    title: string;
    desc: string;
    inscriptions: Inscription[];
  }[];
}

export interface InscribeOrder {
  orderId: string;
  payAddress: string;
  totalFee: number;
  minerFee: number;
  originServiceFee: number;
  serviceFee: number;
  outputValue: number;
}