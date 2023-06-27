// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL
    }
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'IMDb Search',
      link: [{ rel: 'icon', type: 'image/png', href: "/favicon.png" }]
    }
  },
  css: [
    '@/assets/normalize.css',
    '@/assets/global.css'
  ],
  modules: [
    ['@nuxtjs/google-fonts', {
      download: true,
      families: {
        'Work Sans': [300, 500, 800],
        'Belanosima': [400]
      }
    }]
  ],
})
