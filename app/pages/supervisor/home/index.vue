<script setup lang="ts">
import SupervisorNavbar from '~/components/task/SupervisorNavbar.vue'

const { proposals, fetchProposals } = useSupervisorProposals()

const stats = computed(() => {
  const all = proposals.value
  const pending = all.filter(p => p.status === 'submitted').length
  const approved = all.filter(p => p.status === 'supervisor_approved').length
  const rejected = all.filter(p => p.status === 'supervisor_rejected').length
  const changesRequested = all.filter(p => p.status === 'changes_requested').length

  return {
    total: all.length,
    pending,
    approved,
    rejected,
    changesRequested,
  }
})

const recentProposals = computed(() => proposals.value.slice(0, 5))

onMounted(() => {
  fetchProposals()
})
</script>

<template>
  <div class="min-h-screen bg-brand-deep text-slate-100">
    <SupervisorNavbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-2xl font-black text-white tracking-tight">
          Supervisor Dashboard
        </h1>
        <p class="text-slate-400 text-sm mt-1">
          Overview of your teams and proposals
        </p>
      </div>

      <div class="w-full">
        <div class="bg-panel-dark border border-border-dark rounded-xl p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-bold text-white uppercase tracking-widest">
              Recent Proposals
            </h2>
            
          </div>

          <div v-if="!recentProposals.length" class="text-center py-6 text-slate-500 text-sm">
            No proposals yet.
          </div>

          <div v-else class="space-y-3">
            <NuxtLink
              v-for="proposal in recentProposals"
              :key="proposal.id"
              :to="`/supervisor/proposals/${proposal.id}`"
              class="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <div class="min-w-0">
                <p class="text-sm font-bold text-white truncate">
                  {{ proposal.title }}
                </p>
                <p class="text-xs text-slate-500 mt-0.5 truncate">
                  {{ proposal.team?.leader?.name }} • {{ proposal.team?.project_idea?.title }}
                </p>
              </div>
              <span
                class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ml-2"
                :class="proposal.status === 'submitted' ? 'bg-amber-500/10 text-amber-400' : proposal.status === 'supervisor_approved' ? 'bg-emerald-500/10 text-emerald-400' : proposal.status === 'changes_requested' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'"
              >
                {{ proposal.status === 'submitted' ? 'Pending' : proposal.status.replace('supervisor_', '') }}
              </span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>