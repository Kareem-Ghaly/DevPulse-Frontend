<script setup lang="ts">
const route = useRoute()
const authStore = useAuthStore()

const navItems = [
  { label: 'Proposals', icon: 'i-heroicons-clipboard-document-list', to: '/committee/proposals' },
  { label: 'Submissions', icon: 'i-heroicons-inbox', to: '/committee/submissions' },
  { label: 'Announcements', icon: 'i-heroicons-megaphone', to: '/committee/announcements' },
  { label: 'Profile', icon: 'i-heroicons-user-circle', to: '/committee/profile' },
]

const { removeToken, listenToMessages } = useFirebaseMessaging()
const { notifications, unreadCount, fetchNotifications, markAllAsRead } = useNotifications()

onMounted(() => {
  listenToMessages()
  fetchNotifications()
})

const isActive = (path: string) => route.path.startsWith(path)
const showNotifications = ref(false)
const handleLogout = () => {
  authStore.logout()
  navigateTo('/auth/login')
}
</script>

<template>
  <nav class="sticky top-0 z-40 bg-brand-dark border-b border-border-dark">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-3">
          <div class="h-8 w-8 rounded-lg bg-brand-purple flex items-center justify-center text-white font-bold">
            <UIcon name="i-heroicons-bolt" class="h-5 w-5" />
          </div>
          <span class="text-lg font-bold text-white tracking-tight hidden sm:block">DevPulse</span>
          <span class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2 hidden sm:block">Committee</span>
        </div>

        <div class="flex items-center gap-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors"
            :class="isActive(item.to) ? 'bg-brand-purple/10 text-brand-purple' : 'text-slate-400 hover:text-white hover:bg-slate-800'"
          >
            <UIcon :name="item.icon" class="h-5 w-5" />
            <span class="hidden md:block">{{ item.label }}</span>
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
                  @click="n.data?.action_url && navigateTo(n.data.action_url)"
                >
                  <p class="text-xs font-semibold text-white">{{ n.data?.title || 'notice' }}</p>
                  <p class="text-[11px] text-slate-400 mt-0.5">{{ n.data?.body || '' }}</p>
                  <p class="text-[10px] text-slate-600 mt-1">{{ new Date(n.created_at).toLocaleDateString('ar-SA') }}</p>
                </div>
              </div>
            </div>


          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            @click="handleLogout"
          >
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="h-5 w-5" />
            <span class="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>