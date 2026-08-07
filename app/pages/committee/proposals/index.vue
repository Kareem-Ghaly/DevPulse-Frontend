<script setup lang="ts">
import type { CommitteeProposal } from '~/types/committee.types'

const { proposals, isLoading, currentPage, lastPage, fetchProposals } = useCommitteeProposals()

onMounted(() => {
  fetchProposals()
})

const viewProposal = (id: number) => {
  navigateTo(`/committee/proposals/${id}`)
}

const formatDate = (date: string | null) => {
  if (!date) return '-'
  
  return new Date(date).toLocaleDateString()
}

const statusClass = (status: string) => {
  switch (status) {
    case 'submitted_to_committee': return 'bg-amber-500/10 text-amber-400'
    case 'committee_approved': return 'bg-emerald-500/10 text-emerald-400'
    case 'committee_rejected': return 'bg-red-500/10 text-red-400'
    case 'committee_needs_revision': return 'bg-orange-500/10 text-orange-400'
    default: return 'bg-slate-500/10 text-slate-400'
  }
}

const statusLabel = (status: string) => {
  return status.replace(/_/g, ' ')
}
</script>

<template>
  <div class="min-h-screen bg-brand-deep text-slate-100">
    <CommitteeNavbar />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-black text-white tracking-tight">
            Committee Proposals
          </h1>
          <p class="text-slate-400 text-sm mt-1">
            Review and evaluate project proposals
          </p>
        </div>
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-dark border border-border-dark text-sm font-bold text-slate-300 hover:text-white hover:border-border-slate transition-colors cursor-pointer"
          @click="fetchProposals(currentPage)"
        >
          <UIcon name="i-heroicons-arrow-path" :class="['h-4 w-4', isLoading && 'animate-spin']" />
          Refresh
        </button>
      </div>

      <div v-if="isLoading" class="text-center py-12 text-slate-400">
        <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin mx-auto mb-3" />
        <p>Loading proposals...</p>
      </div>

      <div v-else-if="proposals.length === 0" class="text-center py-12">
        <UIcon name="i-heroicons-clipboard-document-list" class="h-12 w-12 mx-auto mb-3 text-slate-600" />
        <h3 class="text-lg font-bold text-white mb-1">
          No proposals pending review
        </h3>
        <p class="text-slate-400 text-sm">
          Project proposals submitted for committee review will appear here.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="proposal in proposals"
          :key="proposal.id"
          class="bg-panel-dark border border-border-dark rounded-xl p-5 hover:border-blue-500/30 transition-colors cursor-pointer"
          @click="viewProposal(proposal.id)"
        >
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-base font-bold text-white truncate pr-4">
              {{ proposal.title }}
            </h3>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap"
              :class="statusClass(proposal.status)"
            >
              {{ statusLabel(proposal.status) }}
            </span>
          </div>

          <p class="text-xs text-slate-400 mb-3 line-clamp-2">
            {{ proposal.team?.project_idea?.abstract || 'No abstract available' }}
          </p>

          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <UIcon name="i-heroicons-user" class="h-3.5 w-3.5" />
              <span>Supervisor: {{ proposal.supervisor_user?.name || '-' }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <UIcon name="i-heroicons-users" class="h-3.5 w-3.5" />
              <span>Leader: {{ proposal.team?.leader?.name || '-' }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <UIcon name="i-heroicons-calendar" class="h-3.5 w-3.5" />
              <span>Submitted: {{ formatDate(proposal.created_at) }}</span>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-3 border-t border-border-dark">
            <div class="flex -space-x-2">
              <div
                v-for="member in proposal.team?.members?.slice(0, 3)"
                :key="member.id"
                class="w-7 h-7 rounded-full bg-slate-700 border border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300"
              >
                {{ member.name.charAt(0).toUpperCase() }}
              </div>
            </div>
            <span v-if="proposal.team?.members && proposal.team.members.length > 3" class="text-[10px] text-slate-500">
              +{{ proposal.team.members.length - 3 }} more
            </span>
          </div>
        </div>
      </div>

      <div v-if="lastPage > 1" class="flex items-center justify-center gap-2 mt-8">
        <button
          :disabled="currentPage <= 1 || isLoading"
          class="px-3 py-2 rounded-lg bg-brand-dark border border-border-dark text-sm font-bold text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          @click="fetchProposals(currentPage - 1)"
        >
          <UIcon name="i-heroicons-chevron-left" class="h-4 w-4" />
        </button>
        <span class="text-sm text-slate-400 px-3">
          Page {{ currentPage }} of {{ lastPage }}
        </span>
        <button
          :disabled="currentPage >= lastPage || isLoading"
          class="px-3 py-2 rounded-lg bg-brand-dark border border-border-dark text-sm font-bold text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          @click="fetchProposals(currentPage + 1)"
        >
          <UIcon name="i-heroicons-chevron-right" class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>