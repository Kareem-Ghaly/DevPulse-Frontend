export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  if (import.meta.client) {
    const savedToken = localStorage.getItem('devpulse_vault_token')
    if (savedToken && !authStore.token) {
      authStore.token = savedToken
    }
  }
})