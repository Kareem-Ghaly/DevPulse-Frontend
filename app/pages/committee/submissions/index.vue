<script setup lang="ts">
const { submissions, isLoading, currentPage, lastPage, fetchSubmissions } = useCommitteeSubmissions()

onMounted(() => {
  fetchSubmissions()
})

const viewSubmission = (id: number) => {
  navigateTo(`/committee/submissions/${id}`)
}

const formatDate = (date: string | null) => {
  if (!date) return '-'
  
  return new Date(date).toLocaleDateString()
}

const statusClass = (status: string) => {
  switch (status) {
    case 'graded': return 'bg-emerald-500/10 text-emerald-400'
    case 'submitted': return 'bg-amber-500/10 text-amber-400'
    default: return 'bg-slate-500/10 text-slate-400'
  }
}
</script>

<template>
  <div class="min-h-screen bg-brand-deep text-slate-100">
    <CommitteeNavbar />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-black text-white tracking-tight">
            Final Submissions
          </h1>
          <p class="text-slate-400 text-sm mt-1">
            Evaluate and grade project submissions
          </p>
        </div>
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-dark border border-border-dark text-sm font-bold text-slate-300 hover:text-white hover:border-border-slate transition-colors cursor-pointer"
          @click="fetchSubmissions(currentPage)"
        >
          <UIcon name="i-heroicons-arrow-path" :class="['h-4 w-4', isLoading && 'animate-spin']" />
          Refresh
        </button>
      </div>

      <div v-if="isLoading" class="text-center py-12 text-slate-400">
        <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin mx-auto mb-3" />
        <p>Loading submissions...</p>
      </div>

      <div v-else-if="submissions.length === 0" class="text-center py-12">
        <UIcon name="i-heroicons-inbox" class="h-12 w-12 mx-auto mb-3 text-slate-600" />
        <h3 class="text-lg font-bold text-white mb-1">
          No submissions yet
        </h3>
        <p class="text-slate-400 text-sm">
          Final project submissions will appear here once students submit them.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="submission in submissions"
          :key="submission.id"
          class="bg-panel-dark border border-border-dark rounded-xl p-5 hover:border-emerald-500/30 transition-colors cursor-pointer"
          @click="viewSubmission(submission.id)"
        >
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-base font-bold text-white truncate pr-4">
              {{ submission.team?.project_idea?.title || 'Untitled Project' }}
            </h3>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap"
              :class="statusClass(submission.status)"
            >
              {{ submission.status }}
            </span>
          </div>

          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <UIcon name="i-heroicons-users" class="h-3.5 w-3.5" />
              <span>Team ID: {{ submission.project_team_id }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <UIcon name="i-heroicons-calendar" class="h-3.5 w-3.5" />
              <span>Submitted: {{ formatDate(submission.created_at) }}</span>
            </div>
            <div v-if="submission.total_grade" class="flex items-center gap-2 text-xs">
              <UIcon name="i-heroicons-star" class="h-3.5 w-3.5 text-emerald-400" />
              <span class="text-emerald-400 font-bold">Total Grade: {{ submission.total_grade }}</span>
            </div>
          </div>

          <div class="flex gap-2 pt-3 border-t border-border-dark">
            <a
              :href="submission.proposal_drive_link"
              target="_blank"
              class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
              @click.stop
            >
              <UIcon name="i-heroicons-document-text" class="h-3.5 w-3.5" />
              Proposal
            </a>
            <a
              :href="submission.presentation_drive_link"
              target="_blank"
              class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
              @click.stop
            >
              <UIcon name="i-heroicons-presentation-chart-line" class="h-3.5 w-3.5" />
              Presentation
            </a>
            <a
              :href="submission.code_drive_link"
              target="_blank"
              class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
              @click.stop
            >
              <UIcon name="i-heroicons-code-bracket" class="h-3.5 w-3.5" />
              Code
            </a>
          </div>
        </div>
      </div>

      <div v-if="lastPage > 1" class="flex items-center justify-center gap-2 mt-8">
        <button
          :disabled="currentPage <= 1 || isLoading"
          class="px-3 py-2 rounded-lg bg-brand-dark border border-border-dark text-sm font-bold text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          @click="fetchSubmissions(currentPage - 1)"
        >
          <UIcon name="i-heroicons-chevron-left" class="h-4 w-4" />
        </button>
        <span class="text-sm text-slate-400 px-3">
          Page {{ currentPage }} of {{ lastPage }}
        </span>
        <button
          :disabled="currentPage >= lastPage || isLoading"
          class="px-3 py-2 rounded-lg bg-brand-dark border border-border-dark text-sm font-bold text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          @click="fetchSubmissions(currentPage + 1)"
        >
          <UIcon name="i-heroicons-chevron-right" class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>