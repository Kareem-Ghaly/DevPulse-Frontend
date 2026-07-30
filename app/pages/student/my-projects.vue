<script setup lang="ts">
import AppTopNav from '~/components/layout/AppTopNav.vue'
import { useProjectList } from '~/composables/useProject/useProjectList.js'


definePageMeta({
  layout: 'blank',
})

const searchQuery = ref('')
const statusFilter = ref('all')

const { projects, isLoadingProjects, publishedCount, formingCount, completedCount } = useProjectList()

const filteredProjects = computed(() => {
  return projects.value.filter((p) => {
    const matchesSearch = !searchQuery.value
      || p.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      || p.abstract.toLowerCase().includes(searchQuery.value.toLowerCase())
      || p.required_skills.some((s: string) => s.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchesStatus = statusFilter.value === 'all' || p.status === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'published', label: 'Published' },
  { value: 'forming', label: 'Forming' },
  { value: 'team_completed', label: 'Team Ready' },
  { value: 'draft', label: 'Draft' },
]
</script>

<template>
  <div class="min-h-screen bg-brand-dark text-slate-100 font-sans antialiased">
    <AppTopNav />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl lg:text-3xl font-black text-white tracking-tight">My Projects</h1>
          <p class="text-sm text-slate-400 mt-1">Manage and track all your project ideas</p>
        </div>
        <NuxtLink
          to="/student/create-project"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
        >
          <UIcon name="i-heroicons-plus" class="h-4 w-4" />
          New Project
        </NuxtLink>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="p-4 rounded-xl border border-slate-800 bg-gradient-to-b from-brand-bg to-brand-deep">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="i-heroicons-folder" class="h-4 w-4 text-blue-400" />
            <span class="text-xs text-slate-500 font-medium">Total Projects</span>
          </div>
          <p class="text-2xl font-black text-white">{{ projects.length }}</p>
        </div>
        <div class="p-4 rounded-xl border border-slate-800 bg-gradient-to-b from-brand-bg to-brand-deep">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="i-heroicons-globe-alt" class="h-4 w-4 text-emerald-400" />
            <span class="text-xs text-slate-500 font-medium">Published</span>
          </div>
          <p class="text-2xl font-black text-emerald-400">{{ publishedCount }}</p>
        </div>
        <div class="p-4 rounded-xl border border-slate-800 bg-gradient-to-b from-brand-bg to-brand-deep">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="i-heroicons-users" class="h-4 w-4 text-amber-400" />
            <span class="text-xs text-slate-500 font-medium">Forming</span>
          </div>
          <p class="text-2xl font-black text-amber-400">{{ formingCount }}</p>
        </div>
        <div class="p-4 rounded-xl border border-slate-800 bg-gradient-to-b from-brand-bg to-brand-deep">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="i-heroicons-check-circle" class="h-4 w-4 text-blue-400" />
            <span class="text-xs text-slate-500 font-medium">Team Ready</span>
          </div>
          <p class="text-2xl font-black text-blue-400">{{ completedCount }}</p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <div class="relative flex-1">
          <UIcon name="i-heroicons-magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search projects, skills..."
            class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-brand-dark border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          >
        </div>
        <select
          v-model="statusFilter"
          class="px-4 py-2.5 rounded-lg bg-brand-dark border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>

      <div v-if="isLoadingProjects" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <div v-for="i in 6" :key="i" class="rounded-xl border border-slate-800 bg-gradient-to-b from-brand-bg to-brand-deep p-5 animate-pulse">
          <div class="flex items-start gap-3 mb-3">
            <div class="h-10 w-10 rounded-lg bg-slate-700 flex-shrink-0" />
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-slate-700 rounded w-3/4" />
              <div class="h-3 bg-slate-700 rounded w-1/2" />
            </div>
          </div>
          <div class="h-3 bg-slate-700 rounded w-full mb-4" />
          <div class="flex gap-2 mb-4">
            <div class="h-5 w-16 bg-slate-700 rounded" />
            <div class="h-5 w-16 bg-slate-700 rounded" />
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <div
          v-for="p in filteredProjects"
          :key="p.id"
          class="group rounded-xl border border-slate-800 bg-gradient-to-b from-brand-bg to-brand-deep p-5 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-600/10 flex-shrink-0">
                {{ getInitials(p.title) }}
              </div>
              <div class="min-w-0">
                <h3 class="text-sm font-bold line-clamp-1 text-white truncate group-hover:text-blue-400 transition-colors">{{ p.title }}</h3>
              </div>
            </div>
          </div>

          <p class="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-1">{{ p.abstract }}</p>

          <div class="flex flex-wrap gap-1.5 mb-4">
            <span
              v-for="skill in p.required_skills"
              :key="skill"
              class="px-2 py-0.5 rounded text-[10px] font-semibold border"
              :class="getSkillClasses(skill)"
            >
              {{ skill }}
            </span>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-slate-800">
            <div class="flex items-center gap-3 text-[11px] text-slate-500">
              <span class="flex items-center gap-1">
                <UIcon name="i-heroicons-users" class="h-3.5 w-3.5" />
                {{ p.team_size }}
              </span>
              <span class="flex items-center gap-1">
                <UIcon name="i-heroicons-calendar" class="h-3.5 w-3.5" />
                {{ formatDate(p.created_at) }}
              </span>
            </div>
            <NuxtLink
              :to="`/student/project-work-space/${p.id}`"
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-dark border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 transition-all cursor-pointer"
            >
              View
              <UIcon name="i-heroicons-arrow-right" class="h-3 w-3" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <EmptyState
        v-if="!isLoadingProjects && filteredProjects.length === 0"
        title="No projects found"
        description="Try adjusting your search or filters"
      />
    </div>
  </div>
</template>