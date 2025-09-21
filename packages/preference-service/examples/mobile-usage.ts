/**
 * Example: How to use PreferenceService in React Native Mobile App
 */

import { PreferenceService } from '@unisat/preference-service'
import { MobileStorageAdapter } from '@unisat/preference-service/adapters'

// Mobile-specific language detection using React Native's APIs
async function getBrowserLanguages(): Promise<string[]> {
  // In React Native, you would use:
  // import { NativeModules, Platform } from 'react-native'
  // const locale = Platform.OS === 'ios' 
  //   ? NativeModules.SettingsManager.settings.AppleLocale ||
  //     NativeModules.SettingsManager.settings.AppleLanguages[0]
  //   : NativeModules.I18nManager.localeIdentifier
  
  // For this example, return default
  return ['en']
}

// Create preference service instance for mobile
const preferenceService = new PreferenceService({
  storage: new MobileStorageAdapter(),
  getBrowserLanguages,
  logger: console,
  t: (key: string) => key, // Use actual i18n function
  template: {
    currentKeyringIndex: 0,
    currentAccount: null,
    editingKeyringIndex: 0,
    editingAccount: null,
    locale: 'en',
    currency: 'USD',
    externalLinkAck: false,
    enableSignData: false,
    showSafeNotice: true,
    chainType: 'BITCOIN_MAINNET' as any,
    networkType: 'livenet' as any,
    addressType: 'P2WPKH' as any,
    balanceMap: {},
    historyMap: {},
    watchAddressPreference: {},
    walletSavedList: [],
    keyringAlianNames: {},
    accountAlianNames: {},
    addressFlags: {},
    uiCachedData: {},
    appTab: {
      summary: { apps: [] },
      readTabTime: 1,
      readAppTime: {},
    },
    initAlianNames: false,
    currentVersion: '1.0.0',
    firstOpen: true,
    skippedVersion: '',
    // Mobile-specific defaults
    guideReaded: false,
    addressSummary: {},
  },
  supportedLocales: ['en', 'zh_CN', 'ja', 'es'],
})

// Initialize and use
async function initMobile() {
  await preferenceService.init()
  
  // Set locale (now uses @unisat/i18n internally)
  await preferenceService.setLocale('zh_CN')
  
  console.log('Current locale:', preferenceService.getLocale())
  console.log('Guide read status:', preferenceService.getGuideReaded())
  
  // Mobile-specific operations
  preferenceService.setGuideReaded(true)
  preferenceService.setAddressSummary('bc1q...', {
    totalSatoshis: 100000,
    btcSatoshis: 80000,
    assetSatoshis: 20000,
  })
}

export { preferenceService, initMobile }