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
      link: [
        { rel: 'icon', type: 'image/png', href: "/favicon.png" },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com'},
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: ''},
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Belanosima&family=Work+Sans:wght@300;500;800&display=swap' },
      ]
    }
  },
  css: [
    '@/assets/normalize.css',
    '@/assets/global.css'
  ]
})
