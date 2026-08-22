export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  icon: {
    serverBundle: {
      collections: ['heroicons', 'lucide']
    }
  },

  runtimeConfig: {
    public: {
      pusherKey: process.env.NUXT_PUBLIC_PUSHER_KEY,
      pusherCluster: process.env.NUXT_PUBLIC_PUSHER_CLUSTER,
      apiBase: 'http://127.0.0.1:8000/api',
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
        target: 'http://127.0.0.1:8000/broadcasting',
        changeOrigin: true,
      },
    },
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      ignore: ['/auth/callback']
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
