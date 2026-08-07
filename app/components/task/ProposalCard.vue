<script setup lang="ts">
import type { SupervisorProposal, ProposalDecisionStatus } from '~/types/supervisor.types'

interface Props {
  proposal: SupervisorProposal
  isSubmitting: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'decision', proposalId: number, status: ProposalDecisionStatus, notes: string): void
  (e: 'view', proposalId: number): void
}>()

const showDecisionModal = ref(false)
const decisionStatus = ref<ProposalDecisionStatus>('approved')
const decisionNotes = ref('')

const openDecision = (status: ProposalDecisionStatus) => {
  decisionStatus.value = status
  decisionNotes.value = ''
  showDecisionModal.value = true
}

const confirmDecision = () => {
  emit('decision', props.proposal.id, decisionStatus.value, decisionNotes.value)
  showDecisionModal.value = false
}

const statusClass = computed(() => {
  switch (props.proposal.status) {
    case 'submitted':
      return 'bg-amber-500/10 text-amber-400'
    case 'supervisor_approved':
      return 'bg-emerald-500/10 text-emerald-400'
    case 'supervisor_rejected':
      return 'bg-red-500/10 text-red-400'
    case 'changes_requested':
      return 'bg-orange-500/10 text-orange-400'
    default:
      return 'bg-slate-500/10 text-slate-400'
  }
})

const statusLabel = computed(() => {
  switch (props.proposal.status) {
    case 'submitted':
      return 'Pending'
    case 'supervisor_approved':
      return 'Approved'
    case 'supervisor_rejected':
      return 'Rejected'
    case 'changes_requested':
      return 'Changes Requested'
    default:
      return props.proposal.status
  }
})
</script>

<template>
  <div class="bg-panel-dark border border-border-dark rounded-xl p-5 hover:border-brand-purple/50 transition-colors">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-base font-bold text-white truncate pr-4">
        {{ proposal.title }}
      </h3>
      <span
        class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap"
        :class="statusClass"
      >
        {{ statusLabel }}
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
        <span>{{ new Date(proposal.created_at).toLocaleDateString() }}</span>
      </div>
    </div>

    <div class="flex items-center gap-2 pt-3 border-t border-border-dark">
      <button
        class="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer"
        @click="emit('view', proposal.id)"
      >
        View Details
      </button>

      <template v-if="proposal.status === 'submitted'">
        <button
          class="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          @click="openDecision('approved')"
        >
          Approve
        </button>
        <button
          class="px-3 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          @click="openDecision('changes_requested')"
        >
          Revise
        </button>
        <button
          class="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          @click="openDecision('rejected')"
        >
          Reject
        </button>
      </template>
    </div>

    <div
      v-if="showDecisionModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      @click.self="showDecisionModal = false"
    >
      <div class="bg-panel-dark border border-border-dark rounded-xl w-full max-w-md p-6 space-y-4">
        <h3 class="text-lg font-bold text-white capitalize">
          {{ decisionStatus === 'changes_requested' ? 'Request Changes' : decisionStatus }} Proposal
        </h3>
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Notes / Feedback
          </label>
          <textarea
            v-model="decisionNotes"
            rows="4"
            placeholder="Enter your feedback..."
            class="w-full bg-slate-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-purple resize-none border border-slate-700"
          />
        </div>
        <div class="flex gap-3">
          <button
            class="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
            @click="showDecisionModal = false"
          >
            Cancel
          </button>
          <button
            :disabled="isSubmitting"
            class="flex-1 bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-bold py-2.5 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
            @click="confirmDecision"
          >
            {{ isSubmitting ? 'Saving...' : 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>