<script setup lang="ts">
import SupervisorNavbar from '~/components/task/SupervisorNavbar.vue'
import type { SupervisorProposal, PaginatedResponse } from '~/types/supervisor.types'

const api = useApiClient()
const appToast = useAppToast()

const proposals = ref<SupervisorProposal[]>([])
const isLoading = ref(false)
const currentPage = ref(1)
const lastPage = ref(1)
const perPage = ref(10)
const total = ref(0)

const fetchApprovedProposals = async (page: number = 1) => {
  isLoading.value = true

  try {
    const res = await api.request<PaginatedResponse<SupervisorProposal>>(`/supervisor/approved-proposals?page=${page}`)
    proposals.value = res.data || []
    currentPage.value = res.meta.current_page
    lastPage.value = res.meta.last_page
    perPage.value = res.meta.per_page
    total.value = res.meta.total
  }
  catch (error: unknown) {
    const err = error as { message?: string }
    appToast.error('Error', err.message || 'Failed to load approved proposals')
    proposals.value = []
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchApprovedProposals()
})

const viewProject = (id: number) => {
  navigateTo(`/supervisor/approved-proposals/${id}/meetings`)
}

const viewTasks = (proposalId: number) => {
  navigateTo(`/supervisor/approved-proposals/${proposalId}/tasks`)
}

const formatDate = (date: string | null) => {
  if (!date) return '-'
  
  return new Date(date).toLocaleDateString()
}
</script>

<template>
  <div class="min-h-screen bg-brand-deep text-slate-100">
    <SupervisorNavbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-black text-white tracking-tight">
            My Approved Projects
          </h1>
          <p class="text-slate-400 text-sm mt-1">
            Projects under your supervision
          </p>
        </div>
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-dark border border-border-dark text-sm font-bold text-slate-300 hover:text-white hover:border-border-slate transition-colors cursor-pointer"
          @click="fetchApprovedProposals(currentPage)"
        >
          <UIcon name="i-heroicons-arrow-path" :class="['h-4 w-4', isLoading && 'animate-spin']" />
          Refresh
        </button>
      </div>
      <div v-if="isLoading" class="text-center py-12 text-slate-400">
        <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin mx-auto mb-3" />
        <p>Loading projects...</p>
      </div>

      <div v-else-if="proposals.length === 0" class="text-center py-12">
        <UIcon name="i-heroicons-check-circle" class="h-12 w-12 mx-auto mb-3 text-slate-600" />
        <h3 class="text-lg font-bold text-white mb-1">
          No approved projects yet
        </h3>
        <p class="text-slate-400 text-sm">
          Projects you approve will appear here.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="proposal in proposals"
          :key="proposal.id"
          class="bg-panel-dark border border-border-dark rounded-xl p-5 hover:border-emerald-500/30 transition-colors"
        >
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-base font-bold text-white truncate pr-4">
              {{ proposal.title }}
            </h3>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 whitespace-nowrap">
              Approved
            </span>
          </div>

          <p class="text-xs text-slate-400 mb-3 line-clamp-2">
            {{ proposal.team?.project_idea?.abstract || 'No abstract available' }}
          </p>

          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <UIcon name="i-heroicons-user" class="h-3.5 w-3.5" />
              <span>By {{ proposal.created_by_user?.name || 'Unknown' }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <UIcon name="i-heroicons-users" class="h-3.5 w-3.5" />
              <span>Leader: {{ proposal.team?.leader?.name || '-' }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <UIcon name="i-heroicons-calendar" class="h-3.5 w-3.5" />
              <span>Approved: {{ formatDate(proposal.supervisor_decided_at) }}</span>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-3 border-t border-border-dark">
            <button
              class="flex-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer"
              @click="viewProject(proposal.id)"
            >
              Manage Meetings
            </button>
            <button
              class="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer"
              @click="viewTasks(proposal.id)"
            >
              Review Tasks
            </button>
          </div>
        </div>
      </div>

      <div v-if="lastPage > 1" class="flex items-center justify-center gap-2 mt-8">
        <button
          :disabled="currentPage <= 1 || isLoading"
          class="px-3 py-2 rounded-lg bg-brand-dark border border-border-dark text-sm font-bold text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          @click="fetchApprovedProposals(currentPage - 1)"
        >
          <UIcon name="i-heroicons-chevron-left" class="h-4 w-4" />
        </button>
        <span class="text-sm text-slate-400 px-3">
          Page {{ currentPage }} of {{ lastPage }}
        </span>
        <button
          :disabled="currentPage >= lastPage || isLoading"
          class="px-3 py-2 rounded-lg bg-brand-dark border border-border-dark text-sm font-bold text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          @click="fetchApprovedProposals(currentPage + 1)"
        >
          <UIcon name="i-heroicons-chevron-right" class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>