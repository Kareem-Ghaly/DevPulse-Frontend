export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const token = useCookie('devpulse_vault_token').value
  const publicRoutes = ['/', '/auth/login', '/auth/register', '/auth/admin/login']

  if (!token && !publicRoutes.includes(to.path)) {
    return navigateTo('/auth/login', { replace: true })
  }
})