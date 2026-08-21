export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/callback',        // ✅ أضف هذا
    '/auth/admin/login',     // ✅ وأضف هذا كمان
  ]

  const token = import.meta.client ? localStorage.getItem('devpulse_vault_token') : null

  if (!token && !publicRoutes.includes(to.path)) {
    return navigateTo('/auth/login', { replace: true })
  }
})
