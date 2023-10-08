export const LOCALES_ARRAY: { label: string; value: Locale }[] = [{
  label: "English",
  value: "en"
}, { label: "日本語", value: "ja" }, { label: "한국어", value: "ko" }]

export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'ja', 'ko']
} as const

export type Locale = (typeof i18n)['locales'][number]