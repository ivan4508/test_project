// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/eslint'],
  css: [
    '~/assets/css/main.scss',
    '~/assets/css/media.scss',
    '~/assets/css/fonts.css',
  ],
  typescript: {
    typeCheck: true,
    strict: true,
  },
  plugins: ['~/plugins/pinia-persist.client.ts'],
  nitro: {
    experimental: {
      wasm: true,
    },
  },
})
