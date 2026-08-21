// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  const publicRoutes = [
    '/',
    '/auth/admin/login',
    '/auth/login',
    '/auth/register',
  ]

  if (!authStore.token && !publicRoutes.includes(to.path)) {
    return navigateTo('/auth/login')
  }
})