<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'

interface Props {
  isTeamComplete: boolean
  projectId: number
  ownerId: number
}

const props = defineProps<Props>()

const router = useRouter()
const authStore = useAuthStore()
const appToast = useAppToast()
const queryClient = useQueryClient()
const api = useApiClient()

const isOwner = computed(() => authStore.user?.id === props.ownerId)

const { mutate: deleteProject, isPending: isDeleting } = useMutation({
  mutationFn: async () => {
    return await api.request<{ status: boolean; message: string }>(`/project-ideas/${props.projectId}`, {
      method: 'DELETE',
    })
  },
  onSuccess: () => {
    appToast.success('Project Deleted', 'The project has been deleted successfully.')
    queryClient.invalidateQueries({ queryKey: ['my-projects'] })
    router.push('/student/my-projects')
  },
  onError: (error: unknown) => {
    const err = error as { data?: { message?: string } }
    appToast.error('Delete Failed', err.data?.message || 'Could not delete the project.')
  },
})

const handleDelete = (): void => {
  if (!isOwner.value)
    return
  if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
    deleteProject()
  }
}

const goToProposal = () => router.push(`/student/project-work-space/${props.projectId}/proposal`)
const goToTeamBuilder = () => router.push(`/student/team-builder/${props.projectId}`)
const goToKanban = () => router.push(`/student/project-work-space/${props.projectId}/proposal`)
</script>

<template>
  <div class="rounded-xl border border-slate-800 bg-gradient-to-b from-brand-bg to-brand-deep p-6">
    <h2 class="text-sm font-bold text-white uppercase tracking-wider mb-4">
      Quick Actions
    </h2>
    <div class="space-y-2">
      <button
        class="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-dark border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 transition-all cursor-pointer"
        @click="goToProposal"
      >
        <UIcon name="i-heroicons-pencil-square" class="h-4 w-4 text-amber-400" />
        Edit Proposal
      </button>
      <button
        v-if="!isTeamComplete"
        class="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-dark border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-purple-500 hover:bg-purple-500/10 transition-all cursor-pointer"
        @click="goToTeamBuilder"
      >
        <UIcon name="i-heroicons-user-plus" class="h-4 w-4 text-blue-400" />
        Invite Member
      </button>
      <button
        v-else
        class="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-dark border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-emerald-500 hover:bg-emerald-500/10 transition-all cursor-pointer"
        @click="goToKanban"
      >
        <UIcon name="i-heroicons-view-columns" class="h-4 w-4 text-emerald-400" />
        Kanban Board
      </button>
      <button
        class="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-dark border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-emerald-500 hover:bg-emerald-500/10 transition-all cursor-pointer"
        @click="$router.go(0)"
      >
        <UIcon name="i-heroicons-arrow-path" class="h-4 w-4 text-emerald-400" />
        Refresh Data
      </button>
      <div class="pt-2 border-t border-slate-800 space-y-1">
        <button
          :disabled="!isOwner || isDeleting"
          class="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-dark border border-rose-900/50 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:border-rose-700 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-rose-900/50"
          @click="handleDelete"
        >
          <UIcon name="i-heroicons-trash" class="h-4 w-4" />
          {{ isDeleting ? 'Deleting...' : 'Delete Project' }}
        </button>
        <p v-if="!isOwner" class="text-[10px] text-slate-500 text-center">
          Only the project owner can delete this project
        </p>
      </div>
    </div>
  </div>
</template>