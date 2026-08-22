export function useApiClient() {
  const config = useRuntimeConfig()

  return {
    request: async <T = any>(url: string, options: any = {}) => {
      const token = process.client ? localStorage.getItem('auth_token') : null

      return $fetch<T>(url, {
        baseURL: config.public.apiBase,
        credentials: 'include',
        ...options,
        headers: {
          ...options.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
    },
  }
}