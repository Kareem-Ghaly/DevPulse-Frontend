<script setup lang="ts">
const route = useRoute()
const authStore = useAuthStore()

const navItems = [
  { label: 'Proposals', icon: 'i-heroicons-clipboard-document-list', to: '/committee/proposals' },
  { label: 'Submissions', icon: 'i-heroicons-inbox', to: '/committee/submissions' },
  { label: 'Announcements', icon: 'i-heroicons-megaphone', to: '/committee/announcements' },
  { label: 'Profile', icon: 'i-heroicons-user-circle', to: '/committee/profile' },
]

const isActive = (path: string) => route.path.startsWith(path)

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