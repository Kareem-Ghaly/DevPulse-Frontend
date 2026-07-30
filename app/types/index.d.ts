import type Echo from 'laravel-echo'
import type Pusher from 'pusher-js'

declare global {
  interface Window {
    Pusher: typeof Pusher
    __ECHO_INSTANCE__: Echo<'reverb'> | null
  }
}

declare module '#app' {
  interface NuxtApp {
    $echo: Echo<'reverb'> | null
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $echo: Echo<'reverb'> | null
  }
}

export {}