<script setup lang="ts">
import AppSidebar from '~/components/layout/AppSidebar.vue'
import AppTopNav from '~/components/layout/AppTopNav.vue'
import InviteButton from '~/components/team/InviteButton.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import { useTeamMatches } from '~/composables/useTeam/useTeamMatches.js'


const route = useRoute()
const router = useRouter()

const projectId = computed(() => Number(route.params.projectId))

const {
  searchQuery,
  filteredMatches,
  isLoadingMatches,
  sendInvitation,
  isInvited,
  isSending,
} = useTeamMatches(projectId)

const goToWorkspace = () => router.push(`/student/project-work-space/${projectId.value}`)

</script>

<template>
  <div class="">
    <AppTopNav/>
    <div class="min-h-screen bg-brand-bg text-white font-sans flex">
      <main class="flex-1 flex flex-col">
        <header class="h-14 border-b border-border-dark px-6 flex items-center justify-between bg-brand-deep sticky top-0 z-10">
          <div class="flex items-center gap-3">
            <button class="text-slate-400 hover:text-white transition-colors" @click="router.back()">
              <UIcon name="i-heroicons-arrow-left" class="h-4 w-4" />
            </button>
            <div>
              <h1 class="text-sm font-bold hidden sm:flex text-white">Team Builder</h1>
              <p class="text-[11px] hidden sm:flex text-slate-500">Find teammates</p>
            </div>
          </div>
  
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
              <div class="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span class="text-xs text-emerald-400 font-medium">{{ filteredMatches.length }} available</span>
            </div>
            <button
              class="flex items-center gap-2 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
              @click="goToWorkspace"
            >
              <UIcon name="i-heroicons-arrow-right" class="h-3.5 w-3.5" />
              Workspace
            </button>
          </div>
        </header>
  
        <div class="p-6 flex flex-col gap-5 flex-1">
          <div class="flex gap-3">
            <div class="relative flex-1">
              <UIcon name="i-heroicons-magnifying-glass" class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name, role, or skills..."
                class="w-full bg-panel-dark border border-border-dark rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-purple transition-colors"
              >
            </div>
          </div>
  
  
          <div v-if="isLoadingMatches" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="i in 4" :key="i" class="bg-panel-dark border border-border-dark rounded-xl p-5 animate-pulse h-48" />
          </div>
  
          <EmptyState
            v-else-if="filteredMatches.length === 0"
            icon="i-heroicons-user-group"
            title="No students found"
            description="Try adjusting your search or filters"
          />
  
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TeamMemberCard
              v-for="match in filteredMatches"
              :key="match.student.id"
              :match="match"
            >
              <template #action>
                <InviteButton
                  :is-invited="isInvited(match.student.id)"
                  :is-sending="isSending(match.student.id)"
                  @click="sendInvitation({ receiver_id: match.student.id })"
                />
              </template>
            </TeamMemberCard>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>