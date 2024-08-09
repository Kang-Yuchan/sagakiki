import type { Locale } from '../i18n.config';
export type Dictionary = {
  title: string;
  description: string;
  placeholder: string;
  search: string;
  apiRequestError: string;
};

type Dictionaries = {
  en: () => Promise<Dictionary>;
  ja: () => Promise<Dictionary>;
  ko: () => Promise<Dictionary>;
};

const dictionaries: Dictionaries = {
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  ja: () => import('../dictionaries/ja.json').then((module) => module.default),
  ko: () => import('../dictionaries/ko.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
