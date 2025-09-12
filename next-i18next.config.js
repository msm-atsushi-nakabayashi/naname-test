export const i18n = {
  defaultLocale: 'ja',
  locales: ['ja', 'en'],
}

module.exports = {
  i18n,
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}