<script setup lang="ts">
import WorkspaceHeader from '~/components/layout/WorkspaceHeader.vue'
import { useProjectDetail } from '~/composables/useProject/useProjectDetail.js'
import { useSupervisorMatches } from '~/composables/useSupervisor/useSupervisorMatches.js'
import { useProposalForm } from '~/composables/useProposal/useProposalForm.js'

const route = useRoute()
const router = useRouter()

const projectId = computed(() => {
  const id = route.params.projectId || route.params.id
  
  return id ? Number(id) : 0
})

const { proposal } = useProposalForm(projectId)
const proposalId = computed(() => proposal.value?.id ?? null)
const proposalStatus = computed(() => proposal.value?.status)

const { projectTitle } = useProjectDetail(projectId)
const { 
  supervisors, 
  isLoadingMatches, 
  isSubmittingSupervisor, 
  isSubmittingCommittee,
  canSubmitToCommittee,
  selectedSupervisor, 
  handleSelectSupervisor,
  submitToCommittee 
} = useSupervisorMatches(projectId, proposalId, proposalStatus)

const activeTab = ref<'supervisor' | 'committee'>('supervisor')

const goBack = () => router.push(`/student/project-work-space/${projectId.value}`)
</script>

<template>
  <div class="min-h-screen bg-brand-dark text-slate-100 font-sans antialiased flex">
    <main class="flex-1 flex flex-col min-h-screen">
      <WorkspaceHeader title="Submit Proposal" :subtitle="projectTitle" @back="goBack" />

      <div class="flex-1 p-4 md:p-8 overflow-y-auto">
        <div class="max-w-4xl mx-auto">
          
          <div class="flex gap-1 mb-6 bg-slate-800/50 p-1 rounded-lg w-fit">
            <button
              class="px-4 py-2 rounded-md text-sm font-medium transition-all"
              :class="activeTab === 'supervisor' ? 'bg-brand-purple text-white' : 'text-slate-400 hover:text-white'"
              @click="activeTab = 'supervisor'"
            >
              <UIcon name="i-heroicons-user" class="h-4 w-4 inline-block mr-1.5" />
              Supervisor
            </button>
            <button
              class="px-4 py-2 rounded-md text-sm font-medium transition-all"
              :class="activeTab === 'committee' ? 'bg-brand-purple text-white' : 'text-slate-400 hover:text-white'"
              @click="activeTab = 'committee'"
            >
              <UIcon name="i-heroicons-users" class="h-4 w-4 inline-block mr-1.5" />
              Committee
            </button>
          </div>

          <div v-if="activeTab === 'supervisor'">
            <div class="mb-8">
              <h2 class="text-xl md:text-2xl font-bold text-white mb-2">Matching Supervisors</h2>
              <p class="text-sm text-slate-400">
                Based on your project's required skills, we found these supervisors that match your interests.
              </p>
            </div>

            <div v-if="isLoadingMatches" class="flex items-center justify-center py-12">
              <UIcon name="i-heroicons-arrow-path" class="h-6 w-6 animate-spin text-brand-purple" />
              <span class="ml-2 text-sm text-slate-400">Finding matching supervisors...</span>
            </div>

            <EmptyState
              v-else-if="supervisors.length === 0"
              icon="i-heroicons-user-group"
              title="No matching supervisors found"
              description="Try updating your project's required skills to find better matches."
            />

            <div v-else class="space-y-4">
              <SupervisorCard
                v-for="match in supervisors"
                :key="match.supervisor.id"
                :match="match"
                :is-submitting="isSubmittingSupervisor"
                :is-selected="selectedSupervisor === match.supervisor.id"
                @select="handleSelectSupervisor"
              />
            </div>
          </div>

          <div v-else>
            <div class="mb-8">
              <h2 class="text-xl md:text-2xl font-bold text-white mb-2">Committee Submission</h2>
              <p class="text-sm text-slate-400">
                Submit your approved proposal to the committee for final review.
              </p>
            </div>

            <div 
              v-if="!canSubmitToCommittee" 
              class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 flex items-start gap-4"
            >
              <UIcon name="i-heroicons-lock-closed" class="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 class="text-sm font-bold text-amber-400 mb-1">Not Available</h3>
                <p class="text-xs text-amber-400/70 leading-relaxed">
                  You can only submit to the committee after your supervisor has approved the proposal.
                  Current status: 
                  <span class="font-bold uppercase">{{ proposalStatus || 'draft' }}</span>
                </p>
              </div>
            </div>

            <div 
              v-else 
              class="bg-panel-dark border border-border-dark rounded-xl p-6 md:p-8"
            >
              <div class="flex items-start gap-4 mb-6">
                <div class="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <UIcon name="i-heroicons-check-badge" class="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 class="text-base font-bold text-white mb-1">Ready for Committee Review</h3>
                  <p class="text-xs text-slate-400">
                    Your proposal has been approved by the supervisor. You can now submit it to the committee for evaluation.
                  </p>
                </div>
              </div>

              <div class="bg-brand-deep rounded-lg p-4 mb-6 space-y-2">
                <div class="flex justify-between text-xs">
                  <span class="text-slate-500">Proposal</span>
                  <span class="text-white font-medium">{{ proposal?.title || 'Untitled' }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-slate-500">Supervisor Status</span>
                  <span class="text-emerald-400 font-medium">Approved</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-slate-500">Next Step</span>
                  <span class="text-brand-purple font-medium">Committee Review</span>
                </div>
              </div>

              <button
                class="w-full flex items-center justify-center gap-2 bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-bold py-3 rounded-lg transition-all disabled:opacity-50"
                :disabled="isSubmittingCommittee"
                @click="submitToCommittee"
              >
                <UIcon
                  v-if="isSubmittingCommittee"
                  name="i-heroicons-arrow-path"
                  class="h-4 w-4 animate-spin"
                />
                <UIcon v-else name="i-heroicons-paper-airplane" class="h-4 w-4" />
                {{ isSubmittingCommittee ? 'Submitting...' : 'Submit to Committee' }}
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>