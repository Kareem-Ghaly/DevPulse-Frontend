<script setup lang="ts">
import AppTopNav from '~/components/layout/AppTopNav.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import LoadingSkeleton from '~/components/ui/LoadingSkeleton.vue'
import { useProjectDetail } from '~/composables/useProject/useProjectDetail.js'
import { useTeamData } from '~/composables/useTeam/useTeamData.js'

const route = useRoute()
const router = useRouter()

definePageMeta({
  layout: 'blank',
  ssr: false,
})

const projectId = computed(() => Number(route.params.projectId))

const { project, isLoadingProject } = useProjectDetail(projectId)
const { team, isTeamComplete, isLoadingTeam } = useTeamData(projectId)

const isLoading = computed(() => isLoadingProject.value || isLoadingTeam.value)

const goToTeamBuilder = () => router.push(`/student/team-builder/${projectId.value}`)
const goToKanban = () => router.push(`/student/project-work-space/${projectId.value}/proposal`)
</script>

<template>
  <ClientOnly>
    <div class="min-h-screen bg-brand-dark text-slate-100 font-sans antialiased">
      <AppTopNav />

      <div v-if="isLoading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSkeleton />
      </div>

      <div v-else-if="project" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectBreadcrumb :title="project.title" />

        <ProjectHeader
          :title="project.title"
          :abstract="project.abstract"
          :status="project.status"
        />

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <ProjectDetailsCard :project="project" />
            <ProjectTeamCard
            :team="team"
            :project="project"
            :is-team-complete="isTeamComplete"
            @invite="goToTeamBuilder"
            @go-to-kanban="goToKanban"
          />
          </div>

          <div class="space-y-6">
            <ProjectQuickActions
              :owner-id="project.owner_id"
              :is-team-complete="isTeamComplete"
              :project-id="projectId"
              :teamId="team.id"
            />
            <ProjectTeamProgress
              :current-members="team.members.length"
              :team-size="project.team_size"
            />
          </div>
        </div>
      </div>

      <EmptyState
        v-else
        icon="i-heroicons-exclamation-triangle"
        title="Project not found"
        description="The project you're looking for doesn't exist or you don't have access."
      >
        <NuxtLink
          to="/student/my-projects"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"
        >
          <UIcon name="i-heroicons-arrow-left" class="h-4 w-4" />
          Back to Projects
        </NuxtLink>
      </EmptyState>
    </div>
  </ClientOnly>
</template>