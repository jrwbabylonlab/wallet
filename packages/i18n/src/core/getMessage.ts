import { Translations } from '../types';

export const getMessage = (
  locale: string,
  translations: Translations | undefined,
  key: string,
  substitutions?: string | string[]
): string => {
  try {
    if (!translations) {
      if (process.env['NODE_ENV'] === 'development') {
        console.warn(`No translations available for locale "${locale}"`);
      }
      return key;
    }

    const translation = translations[key];

    if (!translation) {
      if (process.env['NODE_ENV'] === 'development') {
        console.warn(`Missing translation for key "${key}" in locale "${locale}"`);
      }
      return key;
    }

    let { message } = translation;

    if (substitutions) {
      if (typeof substitutions === 'string') {
        message = message.replace(/\$1/g, substitutions);
      } else {
        substitutions.forEach((substitution, index) => {
          const regex = new RegExp(`\\$${index + 1}`, 'g');
          message = message.replace(regex, substitution);
        });
      }
    }

    return message;
  } catch (error) {
    console.error(`Error getting message for key "${key}" in locale "${locale}":`, error);
    return key;
  }
};