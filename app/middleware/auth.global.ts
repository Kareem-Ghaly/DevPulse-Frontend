export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/callback',
    '/auth/admin/login',
  ]

  const token = import.meta.client ? localStorage.getItem('devpulse_vault_token') : null

  if (!token && !publicRoutes.includes(to.path)) {
    return navigateTo('/auth/login', { replace: true })
  }
})
