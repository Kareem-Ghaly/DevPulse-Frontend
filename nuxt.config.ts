export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  icon: {
    serverBundle: {
      collections: ['uil', 'mdi']
    }
  },

  runtimeConfig: {
    public: {
      pusherKey: process.env.NUXT_PUBLIC_PUSHER_KEY,
      pusherCluster: process.env.NUXT_PUBLIC_PUSHER_CLUSTER,
      apiBase: 'https://devpluse-app.online/api',
      firebaseApiKey: '',
      firebaseAuthDomain: '',
      firebaseProjectId: '',
      firebaseStorageBucket: '',
      firebaseMessagingSenderId: '',
      firebaseAppId: '',
      firebaseVapidKey: '',
    },
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@vee-validate/nuxt',
    '@nuxtjs/seo'
  ],

  plugins: [
    '~/plugins/vue-query.ts'
  ],

  imports: {
    dirs: [
      'services',
      'schemas',
      'types'
    ]
  },

  css: ['~/assets/css/main.css'],

  vite: {
    optimizeDeps: {
      include: [
        '@tanstack/vue-query',
        '@vee-validate/zod',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'zod'
      ]
    }
  },

  nitro: {
    devProxy: {
      '/broadcasting': {
        target: 'https://devpluse-app.online/broadcasting',
        changeOrigin: true,
      },
    },
    preset: 'cloudflare-pages',
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  },

  ogImage: {
    zeroRuntime: true
  },

  experimental: {
    payloadExtraction: true,
    viewTransition: true
  }
})