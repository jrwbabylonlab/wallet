export { WalletProvider, useWallet } from './WalletProvider';
export * from './types';

// Re-export core types from wallet-connect
export type {
  Account,
  BtcBalance,
  ChainType,
  ToSignInput,
  WalletConfig,
  WalletNotifier,
  WalletTranslator,
  WalletType,
} from '@unisat/wallet-connect';

export {
  BaseWallet,
  UniSatWallet,
  OkxWallet,
  XverseWallet,
  ChainType as ChainTypeEnum,
  WalletType as WalletTypeEnum,
  isSupportedAddressType,
  isP2WPKH,
  isTaproot,
} from '@unisat/wallet-connect';
