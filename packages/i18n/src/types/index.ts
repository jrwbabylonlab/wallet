export interface TranslationMessage {
  message: string;
}

export interface Translations {
  [key: string]: TranslationMessage;
}

export interface LocaleLoader {
  loadLocale(locale: string): Promise<Translations>;
}

export interface StorageAdapter {
  getItem(key: string): Promise<string | null> | string | null;
  setItem(key: string, value: string): Promise<void> | void;
}

export interface I18nConfig {
  fallbackLocale: string;
  supportedLocales: string[];
  loader: LocaleLoader;
  storage?: StorageAdapter;
  debug?: boolean;
}

export interface I18nInstance {
  t: (key: string, substitutions?: string | string[]) => string;
  changeLanguage: (locale: string) => Promise<void>;
  getCurrentLocale: () => string;
  getSupportedLocales: () => string[];
  isInitialized: () => boolean;
}