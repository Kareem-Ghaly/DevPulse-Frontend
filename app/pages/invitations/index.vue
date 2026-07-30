<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import AppTopNav from '~/components/layout/AppTopNav.vue'

const invitationService = useInvitationService()
const appToast = useAppToast()
const queryClient = useQueryClient()

const { data: invitationsResponse, isPending: isLoading } = useQuery({
  queryKey: ['my-invitations'],
  queryFn: () => invitationService.getMyInvitations(),
})

const invitations = computed(() => invitationsResponse.value?.data.invitations ?? [])

const { mutate: acceptInvite, isPending: isAccepting } = useMutation({
  mutationFn: (id: number) => invitationService.acceptInvitation(id),
  onSuccess: () => {
    appToast.success('Invitation Accepted', 'You have successfully joined the project.')
    queryClient.invalidateQueries({ queryKey: ['my-invitations'] })
  },
  onError: (error: unknown) => {
    const err = error as { data?: { message?: string } }
    appToast.error('Error', err.data?.message || 'Failed to accept invitation.')
  },
})

const { mutate: rejectInvite, isPending: isRejecting } = useMutation({
  mutationFn: (id: number) => invitationService.rejectInvitation(id),
  onSuccess: () => {
    appToast.success('Invitation Rejected', 'The invitation has been rejected.')
    queryClient.invalidateQueries({ queryKey: ['my-invitations'] })
  },
  onError: (error: unknown) => {
    const err = error as { data?: { message?: string } }
    appToast.error('Error', err.data?.message || 'Failed to reject invitation.')
  },
})

const isProcessing = computed(() => isAccepting.value || isRejecting.value)

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getStatusClasses = (status: string): string => {
  switch (status) {
    case 'accepted':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    case 'rejected':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    default:
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  }
}
</script>

<template>
  <div class="min-h-screen bg-brand-dark text-slate-100 font-sans antialiased">
    <AppTopNav />

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl lg:text-3xl font-black text-white tracking-tight">
            Team Invitations
          </h1>
          <p class="text-sm text-slate-400 mt-1">
            Manage your project invitations
          </p>
        </div>
        <div class="px-3 py-1 rounded-lg bg-brand-bg border border-slate-800 text-xs font-bold text-slate-400">
          {{ invitations.filter(i => i.status === 'pending').length }} Pending
        </div>
      </div>

      <div v-if="isLoading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="rounded-xl border border-slate-800 bg-gradient-to-b from-brand-bg to-brand-deep p-6 animate-pulse space-y-3">
          <div class="h-5 bg-slate-700 rounded w-1/3" />
          <div class="h-4 bg-slate-700 rounded w-2/3" />
          <div class="h-8 bg-slate-700 rounded w-1/4" />
        </div>
      </div>

      <div v-else-if="invitations.length === 0" class="rounded-xl border border-slate-800 bg-gradient-to-b from-brand-bg to-brand-deep p-12 text-center">
        <UIcon name="i-heroicons-inbox" class="h-12 w-12 text-slate-600 mx-auto mb-3" />
        <h3 class="text-lg font-bold text-white mb-1">
          No Invitations
        </h3>
        <p class="text-sm text-slate-400">
          You don't have any project invitations at the moment.
        </p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="invitation in invitations"
          :key="invitation.id"
          class="rounded-xl border border-slate-800 bg-gradient-to-b from-brand-bg to-brand-deep p-6 hover:border-slate-700 transition-all"
        >
          <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div class="flex-1 space-y-3">
              <div class="flex items-center gap-3 flex-wrap">
                <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-600/10 flex-shrink-0">
                  {{ invitation.project_idea.title.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <h3 class="text-base font-bold text-white">
                    {{ invitation.project_idea.title }}
                  </h3>
                  <p class="text-xs text-slate-400">
                    Invited by {{ invitation.sender.name }} • {{ formatDate(invitation.created_at) }}
                  </p>
                </div>
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border"
                  :class="getStatusClasses(invitation.status)"
                >
                  {{ invitation.status }}
                </span>
              </div>

              <p class="text-sm text-slate-400 leading-relaxed break-all line-clamp-1 ">
                {{ invitation.project_idea.abstract }}
              </p>

              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="skill in invitation.project_idea.required_skills"
                  :key="skill"
                  class="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20"
                >
                  {{ skill }}
                </span>
              </div>
            </div>

            <div v-if="invitation.status === 'pending'" class="flex items-center gap-2 lg:flex-shrink-0">
              <button
                type="button"
                :disabled="isProcessing"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                @click="acceptInvite(invitation.id)"
              >
                <UIcon name="i-heroicons-check" class="h-4 w-4" />
                Accept
              </button>
              <button
                type="button"
                :disabled="isProcessing"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-dark border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-rose-500/30 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                @click="rejectInvite(invitation.id)"
              >
                <UIcon name="i-heroicons-x-mark" class="h-4 w-4" />
                Decline
              </button>
            </div>

            <div v-else class="lg:flex-shrink-0">
              <span
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border"
                :class="invitation.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'"
              >
                <UIcon
                  :name="invitation.status === 'accepted' ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                  class="h-4 w-4"
                />
                {{ invitation.status === 'accepted' ? 'Joined' : 'Declined' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>