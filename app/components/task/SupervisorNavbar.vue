<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'

const appToast = useAppToast()
const router = useRouter()
const api = useApiClient()

const { mutate: logoutUser } = useMutation({
  mutationFn: async () => {
    const response = await api.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    })

    return response
    
  },
  onSuccess: () => {
    appToast.success('Logged out', 'You have been successfully logged out.')
    const authStore = useAuthStore()
    authStore.token = ''
    router.push('/auth/login')
  },
  onError: () => {
    appToast.error('Error', 'Failed to logout. Please try again.')
  },
})
</script>

<template>
  <nav class="bg-brand-dark border-b border-border-dark sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="sm:flex hidden items-center gap-3">
          <div class="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/20">
            <UIcon name="i-heroicons-bolt" class="h-5 w-5" />
          </div>
          <span class="text-lg font-bold tracking-tight text-white">DevPulse</span>
        </div>

        <div class="flex items-center gap-6">
          <NuxtLink
            to="/supervisor/home"
            class="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2"
            active-class="text-white"
          >
            Home
          </NuxtLink>

          <NuxtLink
            to="/supervisor/approved-proposals"
            class="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2"
            active-class="text-white"
          >
            Projects
          </NuxtLink>


          <NuxtLink
            to="/profile/supervisor/complete"
            class="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2"
            active-class="text-white"
          >
            Profile
          </NuxtLink>

          <button
          class="text-sm font-medium text-slate-300 hover:text-rose-400 transition-colors flex items-center gap-2 cursor-pointer"
          @click="logoutUser"
          >
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>