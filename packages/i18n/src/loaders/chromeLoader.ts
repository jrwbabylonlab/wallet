import log from 'loglevel';
import { LocaleLoader, Translations } from '../types';
import { FALLBACK_LOCALE } from '../constants';

export class ChromeExtensionLoader implements LocaleLoader {
  private fallbackLocale: string;

  constructor(fallbackLocale: string = FALLBACK_LOCALE) {
    this.fallbackLocale = fallbackLocale;
  }

  async loadLocale(locale: string): Promise<Translations> {
    try {
      const response = await fetch(`/_locales/${locale}/messages.json`);
      log.debug(`Loading language file path: ${response.url}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch locale: ${locale}`);
      }

      const data: Translations = await response.json();
      log.debug(`Successfully loaded ${locale} language file, containing ${Object.keys(data).length} translation items`);

      return data;
    } catch (error) {
      log.error(`Error loading locale ${locale}:`, error);
      
      // If loading fails, try to load the default language
      if (locale !== this.fallbackLocale) {
        return this.loadLocale(this.fallbackLocale);
      }
      
      // If the default language also fails to load, return an empty object
      return {};
    }
  }
}