import log from 'loglevel';
import { LocaleLoader, Translations } from '../types';
import { FALLBACK_LOCALE } from '../constants';

export class FetchLoader implements LocaleLoader {
  private basePath: string;
  private fallbackLocale: string;

  constructor(basePath: string = '/locales', fallbackLocale: string = FALLBACK_LOCALE) {
    this.basePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
    this.fallbackLocale = fallbackLocale;
  }

  async loadLocale(locale: string): Promise<Translations> {
    try {
      const url = `${this.basePath}/${locale}/messages.json`;
      const response = await fetch(url);
      log.debug(`Loading language file from: ${url}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch locale: ${locale} (${response.status})`);
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

export class StaticLoader implements LocaleLoader {
  private translations: Map<string, Translations>;

  constructor(translations: Record<string, Translations> = {}) {
    this.translations = new Map(Object.entries(translations));
  }

  async loadLocale(locale: string): Promise<Translations> {
    const translations = this.translations.get(locale);
    if (!translations) {
      log.warn(`No translations found for locale: ${locale}`);
      return {};
    }
    return translations;
  }

  addTranslations(locale: string, translations: Translations): void {
    this.translations.set(locale, translations);
  }
}