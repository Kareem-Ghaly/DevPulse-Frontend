export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  const cookie = useCookie<string | undefined>('devpulse_vault_token', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    secure: true,
    sameSite: 'lax',
    httpOnly: false,
  })

  if (cookie.value && !authStore.token) {
    authStore.token = cookie.value
  }

  watch(() => authStore.token, (newVal) => {
    if (newVal) {
      cookie.value = newVal
    } else {
      cookie.value = undefined
    }
  })
})