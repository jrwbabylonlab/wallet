// Core exports
export * from './core';
export * from './types';
export * from './constants';

// Factory functions
export * from './factory';

// For backward compatibility, export a simple global instance
import { createChromeI18n, LegacyI18nAPI } from './factory';

// Create a default Chrome-based i18n instance for backward compatibility
let globalI18n: LegacyI18nAPI | null = null;

export const initI18n = async (locale?: string): Promise<void> => {
  if (!globalI18n) {
    const instance = createChromeI18n();
    globalI18n = new LegacyI18nAPI(instance);
  }
  return globalI18n.initI18n(locale);
};

export const t = (key: string, substitutions?: string | string[]): string => {
  if (!globalI18n) {
    console.warn('I18n not initialized, call initI18n() first');
    return key;
  }
  return globalI18n.t(key, substitutions);
};

export const changeLanguage = (locale: string): Promise<void> => {
  if (!globalI18n) {
    throw new Error('I18n not initialized, call initI18n() first');
  }
  return globalI18n.changeLanguage(locale);
};

export const getCurrentLocale = (): string => {
  if (!globalI18n) {
    console.warn('I18n not initialized, call initI18n() first');
    return 'en';
  }
  return globalI18n.getCurrentLocale();
};

export const getCurrentLocaleAsync = (): Promise<string> => {
  if (!globalI18n) {
    console.warn('I18n not initialized, call initI18n() first');
    return Promise.resolve('en');
  }
  return globalI18n.getCurrentLocaleAsync();
};

export const getSupportedLocales = (): string[] => {
  if (!globalI18n) {
    console.warn('I18n not initialized, call initI18n() first');
    return ['en'];
  }
  return globalI18n.getSupportedLocales();
};