import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

declare global {
  interface Window {
    Pusher: typeof Pusher
    __ECHO_INSTANCE__: Echo<'reverb'> | null
  }
}

interface EchoPluginReturn {
  provide: {
    echo: Echo<'reverb'> | null
    initEcho: (token: string) => Echo<'reverb'> | null
  }
}

export default defineNuxtPlugin((): EchoPluginReturn => {
  if (typeof window === 'undefined') {
    return {
      provide: {
        echo: null,
        initEcho: () => null,
      },
    }
  }

  window.Pusher = Pusher

  const initEcho = (token: string): Echo<'reverb'> | null => {
    if (window.__ECHO_INSTANCE__) {
      return window.__ECHO_INSTANCE__
    }

    if (!token) {
      return null
    }

    try {
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`

      const instance = new Echo({
        broadcaster: 'reverb',
        key: 'vpctovzoey05irudhxyr',
        wsHost: '127.0.0.1',
        wsPort: 8080,
        wssPort: 8080,
        forceTLS: false,
        enabledTransports: ['ws', 'wss'],
        authEndpoint: 'http://127.0.0.1:8000/api/broadcasting/auth',
        auth: {
          headers: {
            Authorization: authToken,
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        },
      })

      window.__ECHO_INSTANCE__ = instance

      return instance

    } catch (error) {
      console.error('Echo init failed:', error)

      return null
    }
  }

  const getToken = (): string | null => {
    try {
      const authStore = useAuthStore()

      return authStore.token || null
    } catch (e) {
      return null
    }
  }

  const token = getToken()
  if (token) {
    initEcho(token)
  }

  let attempts = 0
  const interval = setInterval(() => {
    attempts++
    if (window.__ECHO_INSTANCE__ || attempts > 20) {
      clearInterval(interval)

      return
    }
    const retryToken = getToken()
    if (retryToken) initEcho(retryToken)
  }, 500)

  return {
    provide: {
      echo: window.__ECHO_INSTANCE__ || null,
      initEcho,
    },
  }
})