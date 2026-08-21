export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('devpulse_vault_token').value

  const publicRoutes = ['/', '/auth/login', '/auth/register', '/auth/forgot-password']

  if (!token && !publicRoutes.includes(to.path)) {
    return navigateTo('/auth/login', { replace: true })
  }

  if (token && to.path === '/auth/login') {
    return navigateTo('/', { replace: true })
  }
})