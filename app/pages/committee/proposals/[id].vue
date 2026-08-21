<script setup lang="ts">
import type { CommitteeDecisionPayload } from '~/types/committee.types'

const route = useRoute()
const proposalId = computed(() => Number(route.params.id) || 0)

const { singleProposal, isLoading, isSubmitting, fetchProposalById, makeDecision } = useCommitteeProposals()

const decisionForm = reactive<CommitteeDecisionPayload>({
  decision: 'approved',
  notes: '',
})

const showDecisionForm = ref(false)

onMounted(() => {
  if (proposalId.value) {
    fetchProposalById(proposalId.value)
  }
})

const openDecision = (decision: 'approved' | 'rejected' | 'needs_revision') => {
  decisionForm.decision = decision
  decisionForm.notes = ''
  showDecisionForm.value = true
}

const handleDecision = async () => {
  if (!singleProposal.value) return

  await makeDecision(singleProposal.value.id, decisionForm.decision, decisionForm.notes)
  showDecisionForm.value = false
  await fetchProposalById(proposalId.value)
}

const goBack = () => {
  navigateTo('/committee/proposals')
}

const formatDate = (date: string | null) => {
  if (!date) return '-'
  
  return new Date(date).toLocaleString()
}

const statusBannerClass = computed(() => {
  if (!singleProposal.value) return ''

  switch (singleProposal.value.status) {
    case 'submitted_to_committee': return 'bg-amber-500/5 border-amber-500/20'
    case 'committee_approved': return 'bg-emerald-500/5 border-emerald-500/20'
    case 'committee_needs_revision': return 'bg-orange-500/5 border-orange-500/20'
    case 'committee_rejected': return 'bg-red-500/5 border-red-500/20'
    default: return 'bg-slate-500/5 border-slate-500/20'
  }
})

const statusTextClass = computed(() => {
  if (!singleProposal.value) return ''

  switch (singleProposal.value.status) {
    case 'submitted_to_committee': return 'text-amber-400'
    case 'committee_approved': return 'text-emerald-400'
    case 'committee_needs_revision': return 'text-orange-400'
    case 'committee_rejected': return 'text-red-400'
    default: return 'text-slate-400'
  }
})

const statusLabel = computed(() => {
  if (!singleProposal.value) return 'Unknown'

  return singleProposal.value.status.replace(/_/g, ' ')
})
</script>

<template>
  <div class="min-h-screen bg-brand-deep text-slate-100">
    <CommitteeNavbar />
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center gap-3 mb-6">
        <button
          class="text-slate-400 hover:text-white transition-colors cursor-pointer"
          @click="goBack"
        >
          <UIcon name="i-heroicons-arrow-left" class="h-5 w-5" />
        </button>
        <h1 class="text-xl font-black text-white tracking-tight">
          Proposal Review
        </h1>
      </div>

      <div v-if="isLoading" class="text-center py-12 text-slate-400">
        <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin mx-auto mb-3" />
        <p>Loading proposal details...</p>
      </div>

      <div v-else-if="!singleProposal" class="text-center py-12">
        <UIcon name="i-heroicons-exclamation-triangle" class="h-12 w-12 mx-auto mb-3 text-slate-600" />
        <h3 class="text-lg font-bold text-white mb-1">
          Proposal not found
        </h3>
        <button class="mt-4 text-brand-purple text-sm font-bold cursor-pointer" @click="goBack">
          Back to list
        </button>
      </div>

      <div v-else class="space-y-6">
        <div
          class="flex items-center justify-between p-4 rounded-xl border"
          :class="statusBannerClass"
        >
          <div>
            <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</span>
            <p class="text-sm font-bold mt-1 capitalize" :class="statusTextClass">
              {{ statusLabel }}
            </p>
          </div>
          <div v-if="singleProposal.committee_reviews.length > 0">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Reviewed At</span>
            <p class="text-sm text-slate-300 mt-1">
              {{ formatDate(singleProposal.committee_reviews[0].reviewed_at) }}
            </p>
          </div>
        </div>

        <div class="bg-panel-dark border border-border-dark rounded-xl p-5">
          <h2 class="text-sm font-bold text-white mb-4 uppercase tracking-widest">
            Team Information
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-slate-500">Project Idea:</span>
              <p class="text-white font-medium">
                {{ singleProposal.team?.project_idea?.title || '-' }}
              </p>
            </div>
            <div>
              <span class="text-slate-500">Supervisor:</span>
              <p class="text-white font-medium">
                {{ singleProposal.supervisor_user?.name || '-' }} ({{ singleProposal.supervisor_user?.email }})
              </p>
            </div>
            <div>
              <span class="text-slate-500">Team Leader:</span>
              <p class="text-white font-medium">
                {{ singleProposal.team?.leader?.name || '-' }} ({{ singleProposal.team?.leader?.email }})
              </p>
            </div>
            <div class="md:col-span-2">
              <span class="text-slate-500">Members:</span>
              <div class="flex flex-wrap gap-2 mt-1">
                <span
                  v-for="member in singleProposal.team?.members"
                  :key="member.id"
                  class="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300"
                >
                  {{ member.name }} ({{ member.role }})
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-panel-dark border border-border-dark rounded-xl p-5 space-y-5">
          <h2 class="text-sm font-bold text-white uppercase tracking-widest">
            Proposal Content
          </h2>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Title</label>
            <p class="text-sm text-white">{{ singleProposal.title }}</p>
          </div>

          <div v-if="singleProposal.problem">
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Problem</label>
            <p class="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{{ singleProposal.problem }}</p>
          </div>

          <div v-if="singleProposal.problem_overview">
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Problem Overview</label>
            <p class="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{{ singleProposal.problem_overview }}</p>
          </div>

          <div v-if="singleProposal.mind_map_problem_url">
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Mind Map Problem</label>
            <img
              :src="singleProposal.mind_map_problem_url"
              alt="Mind Map Problem"
              class="max-w-full h-auto rounded-lg border border-slate-700"
            >
          </div>

          <div v-if="singleProposal.comparison_table_with_similar_applications">
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Comparison Table</label>
            <p class="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{{ singleProposal.comparison_table_with_similar_applications }}</p>
          </div>

          <div v-if="singleProposal.project_users">
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Target Users</label>
            <p class="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{{ singleProposal.project_users }}</p>
          </div>

          <div v-if="singleProposal.solution_overview">
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Solution Overview</label>
            <p class="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{{ singleProposal.solution_overview }}</p>
          </div>

          <div v-if="singleProposal.proposed_solution">
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Proposed Solution</label>
            <p class="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{{ singleProposal.proposed_solution }}</p>
          </div>

          <div v-if="singleProposal.mind_map_solution_url">
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Mind Map Solution</label>
            <img
              :src="singleProposal.mind_map_solution_url"
              alt="Mind Map Solution"
              class="max-w-full h-auto rounded-lg border border-slate-700"
            >
          </div>

          <div v-if="singleProposal.functional_requirements">
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Functional Requirements</label>
            <p class="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{{ singleProposal.functional_requirements }}</p>
          </div>

          <div v-if="singleProposal.non_functional_requirements">
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Non-Functional Requirements</label>
            <p class="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{{ singleProposal.non_functional_requirements }}</p>
          </div>

          <div v-if="singleProposal.programming_languages">
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Programming Languages</label>
            <p class="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{{ singleProposal.programming_languages }}</p>
          </div>

          <div v-if="singleProposal.project_management">
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Project Management</label>
            <p class="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{{ singleProposal.project_management }}</p>
          </div>
        </div>

        <div v-if="singleProposal.committee_reviews.length > 0" class="bg-slate-800/30 border border-slate-700 rounded-xl p-5">
          <h2 class="text-sm font-bold text-white mb-2 uppercase tracking-widest">
            Previous Reviews
          </h2>
          <div v-for="review in singleProposal.committee_reviews" :key="review.id" class="mb-3 last:mb-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-bold text-slate-400">{{ review.committee_member.name }}</span>
              <span
                class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase"
                :class="review.decision === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : review.decision === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'"
              >
                {{ review.decision }}
              </span>
            </div>
            <p class="text-sm text-slate-300 whitespace-pre-line">{{ review.notes }}</p>
          </div>
        </div>

        <div v-if="singleProposal.status === 'submitted_to_committee'" class="flex gap-3 pt-2">
          <button
            class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold py-3 rounded-lg transition-colors cursor-pointer"
            @click="openDecision('approved')"
          >
            Approve
          </button>
          <!-- <button
            class="flex-1 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold py-3 rounded-lg transition-colors cursor-pointer"
            @click="openDecision('needs_revision')"
          >
            Request Changes
          </button> -->
          <button
            class="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-3 rounded-lg transition-colors cursor-pointer"
            @click="openDecision('rejected')"
          >
            Reject
          </button>
        </div>

        <div v-if="showDecisionForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div class="bg-panel-dark border border-border-dark rounded-xl w-full max-w-md p-6 space-y-4">
            <h3 class="text-lg font-bold text-white capitalize">
              {{ decisionForm.decision === 'needs_revision' ? 'Request Changes' : decisionForm.decision }}
            </h3>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Notes</label>
              <textarea
                v-model="decisionForm.notes"
                rows="4"
                placeholder="Enter your feedback..."
                class="w-full bg-slate-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-purple resize-none border border-slate-700"
              />
            </div>
            <div class="flex gap-3">
              <button
                class="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
                @click="showDecisionForm = false"
              >
                Cancel
              </button>
              <button
                :disabled="isSubmitting"
                class="flex-1 bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-bold py-2.5 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                @click="handleDecision"
              >
                {{ isSubmitting ? 'Saving...' : 'Confirm' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>