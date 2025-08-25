import log from 'loglevel';
import { I18nConfig, I18nInstance, Translations, StorageAdapter } from '../types';
import { getMessage } from './getMessage';
import { LocalStorageAdapter } from './storage';

export class I18n implements I18nInstance {
  private config: I18nConfig;
  private currentLocale: string;
  private translations: Map<string, Translations> = new Map();
  private initialized = false;
  private storage: StorageAdapter;

  constructor(config: I18nConfig) {
    this.config = config;
    this.currentLocale = config.fallbackLocale;
    this.storage = config.storage || new LocalStorageAdapter();
    
    if (config.debug) {
      log.setLevel('debug');
    }
  }

  async init(locale?: string): Promise<void> {
    try {
      const targetLocale = locale || this.config.fallbackLocale;
      
      // Load the target locale
      await this.loadLocale(targetLocale);
      
      // Set current locale
      this.currentLocale = targetLocale;
      
      // Save to storage
      await this.storage.setItem('i18nextLng', targetLocale);
      
      this.initialized = true;
      log.debug(`I18n initialized with locale: ${targetLocale}`);
    } catch (error) {
      log.error('Failed to initialize i18n:', error);
      // Fallback to default locale
      this.currentLocale = this.config.fallbackLocale;
      this.initialized = true;
    }
  }

  private async loadLocale(locale: string): Promise<void> {
    if (this.translations.has(locale)) {
      return;
    }

    try {
      const translations = await this.config.loader.loadLocale(locale);
      this.translations.set(locale, translations);
      log.debug(`Loaded translations for locale: ${locale}`);
    } catch (error) {
      log.error(`Failed to load locale ${locale}:`, error);
      if (locale !== this.config.fallbackLocale) {
        await this.loadLocale(this.config.fallbackLocale);
      }
    }
  }

  t = (key: string, substitutions?: string | string[]): string => {
    if (!this.initialized) {
      log.warn('I18n not initialized, returning key');
      return key;
    }

    const translations = this.translations.get(this.currentLocale);
    let result = getMessage(this.currentLocale, translations, key, substitutions);

    // If translation not found and current locale is not fallback, try fallback
    if (result === key && this.currentLocale !== this.config.fallbackLocale) {
      const fallbackTranslations = this.translations.get(this.config.fallbackLocale);
      result = getMessage(this.config.fallbackLocale, fallbackTranslations, key, substitutions);
    }

    return result;
  };

  async changeLanguage(locale: string): Promise<void> {
    if (!this.config.supportedLocales.includes(locale)) {
      log.warn(`Locale ${locale} is not supported`);
      return;
    }

    try {
      await this.loadLocale(locale);
      this.currentLocale = locale;
      await this.storage.setItem('i18nextLng', locale);
      log.debug(`Language changed to: ${locale}`);
    } catch (error) {
      log.error(`Failed to change language to ${locale}:`, error);
      throw error;
    }
  }

  getCurrentLocale(): string {
    return this.currentLocale;
  }

  getSupportedLocales(): string[] {
    return this.config.supportedLocales;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async getCurrentLocaleAsync(): Promise<string> {
    if (this.initialized) {
      return this.currentLocale;
    }

    // Try to get from storage
    try {
      const storedLocale = await this.storage.getItem('i18nextLng');
      if (storedLocale && this.config.supportedLocales.includes(storedLocale)) {
        return storedLocale;
      }
    } catch (error) {
      log.debug('Failed to get locale from storage:', error);
    }

    return this.config.fallbackLocale;
  }
}