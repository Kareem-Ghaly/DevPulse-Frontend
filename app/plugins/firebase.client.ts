import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
  }

  const app = initializeApp(firebaseConfig)
  const messaging = getMessaging(app)

  return {
    provide: {
      firebaseApp: app,
      firebaseMessaging: messaging,
    }
  }
})