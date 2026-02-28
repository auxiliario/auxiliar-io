import fs from 'fs';
import path from 'path';
import { SUPPORTED_LANGS, DEFAULT_LANG } from './constants';

const cache = {};

export function getTranslations(lang, namespace) {
  const safeLang = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
  const key = `${safeLang}/${namespace}`;

  if (cache[key]) return cache[key];

  try {
    const filePath = path.join(process.cwd(), 'locales', safeLang, `${namespace}.json`);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    cache[key] = data;
    return data;
  } catch {
    if (safeLang !== DEFAULT_LANG) {
      return getTranslations(DEFAULT_LANG, namespace);
    }
    return {};
  }
}

export function t(translations, key, fallback) {
  const keys = key.split('.');
  let value = translations;
  for (const k of keys) {
    if (value == null || typeof value !== 'object') return fallback || key;
    value = value[k];
  }
  return value != null ? value : (fallback || key);
}
