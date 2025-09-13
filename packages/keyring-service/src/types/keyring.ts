import { bitcoin } from '@unisat/wallet-bitcoin'
import { CosmosSignDataType } from './cosmos'

// ToSignInput interface defined here to avoid circular imports
export interface ToSignInput {
  index: number
  publicKey: string
  useTweakedSigner?: boolean
  disableTweakSigner?: boolean
  tapLeafHashToSign?: Buffer
  sighashTypes?: number[] | undefined
}

export interface Keyring {
  type: string
  mfp?: string
  accounts?: string[]

  serialize(): Promise<any>
  deserialize(opts: any): Promise<void>
  addAccounts(n: number): Promise<string[]>
  getAccounts(): Promise<string[]>
  signTransaction(psbt: bitcoin.Psbt, inputs: ToSignInput[]): Promise<bitcoin.Psbt>
  signMessage(address: string, message: string): Promise<string>
  signData(address: string, data: string, type: string): Promise<string>
  verifyMessage(address: string, message: string, sig: string): Promise<boolean>
  exportAccount(address: string): Promise<string>
  removeAccount(address: string): void

  // Optional methods for different keyring types
  unlock?(): Promise<void>
  getFirstPage?(): Promise<{ address: string; index: number }[]>
  getNextPage?(): Promise<{ address: string; index: number }[]>
  getPreviousPage?(): Promise<{ address: string; index: number }[]>
  getAddresses?(start: number, end: number): { address: string; index: number }[]
  getIndexByAddress?(address: string): number

  getAccountsWithBrand?(): { address: string; index: number }[]
  activeAccounts?(indexes: number[]): string[]

  changeHdPath?(hdPath: string): void
  getAccountByHdPath?(hdPath: string, index: number): string

  // Keystone specific methods
  genSignPsbtUr?(psbtHex: string): Promise<{ type: string; cbor: string }>
  parseSignPsbtUr?(type: string, cbor: string): Promise<string>
  genSignMsgUr?(
    publicKey: string,
    text: string
  ): Promise<{ type: string; cbor: string; requestId: string }>
  parseSignMsgUr?(
    type: string,
    cbor: string
  ): Promise<{ requestId: string; publicKey: string; signature: string }>
  getConnectionType?(): 'USB' | 'QR'
  genSignCosmosUr?(cosmosSignRequest: {
    requestId?: string
    signData: string
    dataType: CosmosSignDataType
    path: string
    chainId?: string
    accountNumber?: string
    address?: string
  }): Promise<{ type: string; cbor: string; requestId: string }>
  parseSignCosmosUr?(type: string, cbor: string): Promise<any>
}

// Keyring types
export enum KeyringType {
  HdKeyring = 'HD Key Tree',
  SimpleKeyring = 'Simple Key Pair',
  KeystoneKeyring = 'Keystone',
  ColdWalletKeyring = 'Cold Wallet',
  ReadonlyKeyring = 'Readonly',
  Empty = 'Empty',
}
