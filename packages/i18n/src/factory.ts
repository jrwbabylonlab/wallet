import { I18n } from './core/i18n';
import { ChromeExtensionLoader } from './loaders/chromeLoader';
import { FetchLoader, StaticLoader } from './loaders/fetchLoader';
import { ChromeStorageAdapter, LocalStorageAdapter, MemoryStorageAdapter } from './core/storage';
import { I18nConfig, I18nInstance, Translations } from './types';
import { DEFAULT_I18N_CONFIG } from './constants';

export interface ChromeI18nOptions {
  fallbackLocale?: string;
  supportedLocales?: string[];
  debug?: boolean;
  useLocalStorage?: boolean;
}

export interface FetchI18nOptions {
  fallbackLocale?: string;
  supportedLocales?: string[];
  localesPath?: string;
  debug?: boolean;
}

export interface StaticI18nOptions {
  fallbackLocale?: string;
  supportedLocales?: string[];
  translations?: Record<string, Translations>;
  debug?: boolean;
}

export function createChromeI18n(options: ChromeI18nOptions = {}): I18nInstance {
  const config: I18nConfig = {
    fallbackLocale: options.fallbackLocale || DEFAULT_I18N_CONFIG.fallbackLocale,
    supportedLocales: options.supportedLocales || DEFAULT_I18N_CONFIG.supportedLocales,
    loader: new ChromeExtensionLoader(options.fallbackLocale),
    storage: options.useLocalStorage ? new LocalStorageAdapter() : new ChromeStorageAdapter(),
    debug: options.debug || DEFAULT_I18N_CONFIG.debug
  };

  return new I18n(config);
}

export function createFetchI18n(options: FetchI18nOptions = {}): I18nInstance {
  const config: I18nConfig = {
    fallbackLocale: options.fallbackLocale || DEFAULT_I18N_CONFIG.fallbackLocale,
    supportedLocales: options.supportedLocales || DEFAULT_I18N_CONFIG.supportedLocales,
    loader: new FetchLoader(options.localesPath, options.fallbackLocale),
    storage: new LocalStorageAdapter(),
    debug: options.debug || DEFAULT_I18N_CONFIG.debug
  };

  return new I18n(config);
}

export function createStaticI18n(options: StaticI18nOptions = {}): I18nInstance {
  const config: I18nConfig = {
    fallbackLocale: options.fallbackLocale || DEFAULT_I18N_CONFIG.fallbackLocale,
    supportedLocales: options.supportedLocales || DEFAULT_I18N_CONFIG.supportedLocales,
    loader: new StaticLoader(options.translations),
    storage: new MemoryStorageAdapter(),
    debug: options.debug || DEFAULT_I18N_CONFIG.debug
  };

  return new I18n(config);
}

// Legacy compatibility API - similar to the original unisat-extension API
export class LegacyI18nAPI {
  private i18n: I18nInstance;

  constructor(i18n: I18nInstance) {
    this.i18n = i18n;
  }

  async initI18n(locale?: string): Promise<void> {
    if ('init' in this.i18n && typeof this.i18n.init === 'function') {
      await this.i18n.init(locale);
    }
  }

  t = (key: string, substitutions?: string | string[]): string => {
    return this.i18n.t(key, substitutions);
  };

  changeLanguage = (locale: string): Promise<void> => {
    return this.i18n.changeLanguage(locale);
  };

  getCurrentLocale = (): string => {
    return this.i18n.getCurrentLocale();
  };

  async getCurrentLocaleAsync(): Promise<string> {
    if ('getCurrentLocaleAsync' in this.i18n && typeof this.i18n.getCurrentLocaleAsync === 'function') {
      return this.i18n.getCurrentLocaleAsync();
    }
    return this.i18n.getCurrentLocale();
  }

  getSupportedLocales = (): string[] => {
    return this.i18n.getSupportedLocales();
  };
}