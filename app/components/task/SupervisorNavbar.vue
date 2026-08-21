<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'

const appToast = useAppToast()
const router = useRouter()
const api = useApiClient()
const authStore = useAuthStore()

const showNotifications = ref(false)
const { removeToken, listenToMessages } = useFirebaseMessaging()
const { notifications, unreadCount, fetchNotifications, markAllAsRead } = useNotifications()

onMounted(() => {
  listenToMessages()
  fetchNotifications()
})

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
          <div class="flex items-center gap-3">
          <div class="relative">
            <button
              type="button"
              class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all relative"
              @click="showNotifications = !showNotifications"
            >
              <UIcon name="i-heroicons-bell" class="h-5 w-5" />
              <span
                v-if="unreadCount > 0"
                class="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center"
              >
                {{ unreadCount }}
              </span>
            </button>

            <div
              v-if="showNotifications"
              class="absolute right-0 top-full mt-2 w-80 bg-brand-dark border border-slate-700 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto"
            >
              <div class="p-3 border-b border-slate-800 flex items-center justify-between">
                <span class="text-sm font-bold text-white">Notifications</span>
                <button
                  v-if="unreadCount > 0"
                  class="text-xs hover:cursor-pointer text-brand-purple hover:text-brand-purple-hover"
                  @click="markAllAsRead"
                >
                 Make All As Read
                </button>
              </div>
              
              <div v-if="!notifications?.length" class="p-4 text-center text-xs text-slate-500">
               No Notifications
              </div>
              
              <div
                v-for="n in notifications"
                :key="n.id"
                class="p-3 border-b border-slate-800/50 hover:bg-slate-800/30 cursor-pointer transition-colors"
                :class="{ 'bg-slate-800/20': !n.read_at }"
              >
                <p class="text-xs font-semibold text-white">{{ n.data?.title || 'notice' }}</p>
                <p class="text-[11px] text-slate-400 mt-0.5">{{ n.data?.body || '' }}</p>
                <p class="text-[10px] text-slate-600 mt-1">{{ new Date(n.created_at).toLocaleDateString('ar-SA') }}</p>
              </div>
            </div>
          </div>

          <NuxtLink
            to="/profile"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-800/50 transition-all"
          >
            <div class="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
            </div>
            <span class="text-sm font-medium text-slate-300 hidden sm:block">{{ authStore.user?.name || 'User' }}</span>
          </NuxtLink>

        </div>

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