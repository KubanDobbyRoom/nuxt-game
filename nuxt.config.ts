// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['@/assets/styles/main.css'],
  modules: ['@pinia/colada-nuxt', '@pinia/nuxt', '@nuxt/hints'],
  pinia: {
    storesDirs: ['stores/**'],
  },
  runtimeConfig: {
    server: {
      telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
      supabase: {
        url: process.env.SUPABASE_URL,
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    },
  },
})