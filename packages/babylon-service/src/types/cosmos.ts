export interface Key {
  name: string
  algo: string
  pubKey: Uint8Array
  address: Uint8Array
  bech32Address: string
  isNanoLedger: boolean
}

export interface CosmosBalance {
  denom: string
  amount: string
}

// Cosmos signing data types
// Re-export from cosmosChain to avoid duplication
export type { CosmosChainInfo } from './cosmosChain'

export enum CosmosSignDataType {
  amino = 'amino',
  direct = 'direct',
}

// Babylon specific types
export interface BabylonAddressSummary {
  address: string
  balance: CosmosBalance
  rewardBalance: number
  stakedBalance: number
}
