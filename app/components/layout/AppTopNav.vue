<script setup lang="ts">
const authStore = useAuthStore()
const sidebar = useSidebar()
const isMobileMenuOpen = ref(false)

const { removeToken, listenToMessages } = useFirebaseMessaging()
const { notifications, unreadCount, fetchNotifications, markAllAsRead } = useNotifications()
const showNotifications = ref(false)

const handleLogout = async (): Promise<void> => {
  await removeToken()
  await authStore.logout()
  await navigateTo('/auth/login')
}

const toggleMobileMenu = (): void => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = (): void => {
  isMobileMenuOpen.value = false
}

onMounted(() => {
  listenToMessages()
  fetchNotifications()
})
</script>

<template>
  <nav class="sticky top-0 z-50 border-b border-slate-800 bg-brand-dark/80 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-3">
          

          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/20">
              <UIcon name="i-heroicons-bolt" class="h-5 w-5" />
            </div>
            <span class="text-lg font-bold tracking-tight text-white">DevPulse</span>
          </NuxtLink>
        </div>

        <div class="hidden md:flex items-center gap-1">
          <NuxtLink
            to="/student/my-projects"
            class="px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
            active-class="text-white bg-slate-800/50"
          >
            My Projects
          </NuxtLink>
          <NuxtLink
            to="/invitations"
            class="px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
            active-class="text-white bg-slate-800/50"
          >
            Invitations
          </NuxtLink>
          <NuxtLink
            to="/student/announcements"
            class="px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
            active-class="text-white bg-slate-800/50"
          >
            Announcements
          </NuxtLink>
          
        </div>

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

          <NuxtLink
            to="/profile"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-800/50 transition-all"
          >
            <div class="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
            </div>
            <span class="text-sm font-medium text-slate-300 hidden sm:block">{{ authStore.user?.name || 'User' }}</span>
          </NuxtLink>

          <button
            type="button"
            class="hidden md:block p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
            @click="handleLogout"
          >
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="h-5 w-5" />
          </button>

          <button
            type="button"
            class="md:hidden p-2 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
            @click="toggleMobileMenu"
          >
            <UIcon name="i-heroicons-bars-3" class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="isMobileMenuOpen"
      class="md:hidden border-t border-slate-800 bg-brand-dark/95 backdrop-blur-md"
    >
      <div class="px-4 py-3 space-y-1">
        <NuxtLink
          to="/student/my-projects"
          class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
          active-class="text-white bg-slate-800/50"
          @click="closeMobileMenu"
        >
          My Projects
        </NuxtLink>
        <NuxtLink
          to="/invitations"
          class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
          active-class="text-white bg-slate-800/50"
          @click="closeMobileMenu"
        >
          Invitations
        </NuxtLink>
        <NuxtLink
          to="/profile"
          class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
          active-class="text-white bg-slate-800/50"
          @click="closeMobileMenu"
        >
          Profile
        </NuxtLink>
        <button
          type="button"
          class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer"
          @click="handleLogout"
        >
          <UIcon name="i-heroicons-arrow-right-on-rectangle" class="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>