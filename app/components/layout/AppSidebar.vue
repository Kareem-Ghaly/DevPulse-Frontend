<script setup lang="ts">
interface SidebarItem {
  label: string
  icon: string
  to?: string
  active?: boolean
  onClick?: () => void
}



interface Props {
  items: SidebarItem[]
  showUser?: boolean
  userName?: string
  userRole?: string
}

const authStore = useAuthStore()
const sidebar = useSidebar()
const resolvedUserName = computed(() => authStore.user?.name || userName)

withDefaults(defineProps<Props>(), {
  showUser: true,
  userName: 'Alex Chen',
  userRole: 'Student',
})
</script>

<template>
  <div
    v-if="sidebar.isOpen"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden transition-opacity"
    @click="sidebar.close"
  />

  <aside
    class="w-64 md:w-56 bg-brand-deep border-r border-border-dark flex flex-col py-4 px-3 gap-1 fixed h-full z-30 transition-transform duration-300 ease-in-out md:translate-x-0 shadow-2xl md:shadow-none"
    :class="sidebar.isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="flex items-center gap-2 px-2 mb-6">
      <div class="h-8 w-8 md:h-7 md:w-7 rounded-md bg-brand-purple flex items-center justify-center shrink-0">
        <UIcon name="i-heroicons-bolt" class="h-5 w-5 md:h-4 md:w-4 text-white" />
      </div>
      <span class="text-base md:text-sm font-semibold text-white">DevPulse</span>
    </div>

    <nav class="flex flex-col gap-1 flex-1 overflow-y-auto">
      <button
        v-for="item in items"
        :key="item.label"
        class="flex items-center gap-3 md:gap-2.5 px-3 py-3 md:py-2 rounded-lg text-left transition-colors active:scale-[0.98]"
        :class="item.active ? 'bg-panel-dark text-white' : 'text-slate-400 hover:text-white hover:bg-panel-dark'"
        @click="item.onClick ? item.onClick() : item.to && $router.push(item.to)"
      >
        <UIcon :name="item.icon" class="h-5 w-5 shrink-0" :class="item.active ? 'text-brand-purple' : 'text-slate-500'" />
        <span class="text-sm">{{ item.label }}</span>
      </button>
    </nav>

    <div v-if="showUser" class="border-t border-border-dark pt-3 mt-auto">
      <div class="flex items-center gap-2 px-2 pt-3">
        <div class="h-8 w-8 md:h-7 md:w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {{ resolvedUserName?.charAt(0)?.toUpperCase() || 'U' }}
        </div>
        <div class="flex flex-col min-w-0">
          <span class="text-xs text-white font-medium leading-tight truncate">{{ resolvedUserName }}</span>
          <span class="text-[10px] text-slate-500">{{ userRole }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>