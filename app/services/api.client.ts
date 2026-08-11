export const useApiClient = () => {
  const authStore = useAuthStore()
  const appToast = useAppToast()
  const config = useRuntimeConfig()
  const BASE_URL = config.public.apiBase;

  const request = async <T>(endpoint: string, options: Parameters<typeof $fetch>[1] = {}): Promise<T> => {
    const activeToken = authStore.token

    if (options.body instanceof FormData) {
      const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

      const response = await fetch(url, {
        method: options.method || 'POST',
        
        headers: {
          ...(activeToken && { Authorization: `Bearer ${activeToken}` }),
          'Accept': 'application/json',
        },
        body: options.body,
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        const errorMessage = data?.message || 'An unexpected server error occurred.'

        if (response.status === 403) {
          appToast.warning('Your Account is Under Review', errorMessage)
        }
        // else {
        //   appToast.error('Server Error', errorMessage)
        // }

        throw new Error(errorMessage)
      }

      return data as T
    }

    const fetchOptions: Parameters<typeof $fetch>[1] = {
      baseURL: BASE_URL,
      method: options.method || 'GET',
      ...options,
      headers: {
        ...(activeToken && { Authorization: `Bearer ${activeToken}` }),
        'Accept': 'application/json',
        ...options.headers,
      },
      onResponseError({ response }) {
        const errorMessage = response._data?.message || 'An unexpected server error occurred.'

        if (response.status === 403) {
          appToast.warning('Your Account is Under Review', errorMessage)
        }
        else {
          appToast.error('Server Error', errorMessage)
        }
      },
    }

    const nativeFetch = $fetch.raw as (request: string, opts?: typeof fetchOptions) => Promise<{ _data: T }>
    const response = await nativeFetch(endpoint, fetchOptions)

    return response._data
  }

  return {
    request,
  }
}