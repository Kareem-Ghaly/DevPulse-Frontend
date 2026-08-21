import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // ✅ إذا مافيش projectId، ما تشغلش Firebase
  if (!config.public.firebaseProjectId) {
    console.warn('[Firebase] Not configured - skipping initialization')
    return {
      provide: {
        firebaseApp: null,
        firebaseMessaging: null,
      }
    }
  }

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
  }

  try {
    const app = initializeApp(firebaseConfig)
    const messaging = getMessaging(app)

    return {
      provide: {
        firebaseApp: app,
        firebaseMessaging: messaging,
      }
    }
  } catch (err) {
    console.error('[Firebase] Initialization failed:', err)
    return {
      provide: {
        firebaseApp: null,
        firebaseMessaging: null,
      }
    }
  }
})
