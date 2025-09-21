/**
 * Example: How to use PreferenceService in Chrome Extension
 */

import { PreferenceService } from '@unisat/preference-service'
import { ExtensionStorageAdapter } from '@unisat/preference-service/adapters'

// Extension-specific browser language detection
async function getBrowserLanguages(): Promise<string[]> {
  if (typeof chrome !== 'undefined' && chrome.i18n) {
    const acceptLanguages = await new Promise<string[]>((resolve) => {
      chrome.i18n.getAcceptLanguages((languages) => {
        resolve(languages)
      })
    })
    return acceptLanguages
  }
  return ['en']
}

// Create preference service instance for extension
const preferenceService = new PreferenceService({
  storage: new ExtensionStorageAdapter(),
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
    // Extension-specific defaults
    autoLockTimeId: 0,
    openInSidePanel: false,
    developerMode: false,
  },
  supportedLocales: ['en', 'zh_CN', 'ja', 'es'],
})

// Initialize and use
async function initExtension() {
  await preferenceService.init()
  
  // Set locale (now uses @unisat/i18n internally)
  await preferenceService.setLocale('zh_CN')
  
  console.log('Current locale:', preferenceService.getLocale())
  console.log('Auto lock time ID:', preferenceService.getAutoLockTimeId())
  console.log('Developer mode:', preferenceService.getDeveloperMode())
}

export { preferenceService, initExtension }