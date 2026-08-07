<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppTopNav from '~/components/layout/AppTopNav.vue'

const { announcements, meta, isLoading, fetchAnnouncements } = useAnnouncements()
const currentPage = ref<number>(1)

onMounted(() => {
  fetchAnnouncements(currentPage.value)
})

const changePage = (page: number): void => {
  if (page < 1 || (meta.value && page > meta.value.last_page)) return

  currentPage.value = page
  fetchAnnouncements(currentPage.value)
}
</script>

<template>
  <div class="">
    <AppTopNav />
    <div class="min-h-screen bg-brand-dark text-slate-100 p-4 md:p-8">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-xl md:text-2xl font-bold text-white mb-6">Announcements</h1>
        
        <div v-if="isLoading" class="flex justify-center py-12">
          <UIcon name="i-heroicons-arrow-path" class="h-6 w-6 animate-spin text-brand-purple" />
        </div>
 
        <div v-else-if="!announcements.length" class="text-center py-12 text-slate-500 text-sm">
          No announcements yet.
        </div>
 
        <div v-else class="space-y-4">
          <div 
            v-for="a in announcements" 
            :key="a.id" 
            class="bg-panel-dark border border-border-dark rounded-xl p-4 md:p-6 hover:border-slate-600 transition-all"
          >
            <h3 class="text-base font-bold text-white mb-2">{{ a.title }}</h3>
            <p class="text-sm text-slate-400 leading-relaxed mb-3">{{ a.body }}</p>
            <div class="flex items-center gap-2 text-[11px] text-slate-600">
              <span>By {{ a.created_by || 'Admin' }}</span>
              <span>•</span>
              <span>{{ new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
            </div>
          </div>

          <div v-if="meta && meta.last_page > 1" class="flex items-center justify-between pt-6 border-t border-slate-800 mt-6">
            <button 
              @click="changePage(currentPage - 1)" 
              :disabled="currentPage === 1"
              class="px-4 py-2 bg-panel-dark border border-border-dark text-xs font-bold text-white rounded-lg disabled:opacity-40 hover:border-slate-600 transition-all"
            >
              Previous
            </button>

            <span class="text-xs text-slate-400">
              Page {{ meta.current_page }} of {{ meta.last_page }}
            </span>

            <button 
              @click="changePage(currentPage + 1)" 
              :disabled="currentPage === meta.last_page"
              class="px-4 py-2 bg-panel-dark border border-border-dark text-xs font-bold text-white rounded-lg disabled:opacity-40 hover:border-slate-600 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>