<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import AppTopNav from '~/components/layout/AppTopNav.vue'

const authService = useAuthService()
const appToast = useAppToast()

const { data: meResponse, isPending: isLoading } = useQuery({
  queryKey: ['auth-me'],
  queryFn: () => authService.getMe(),
})

const user = computed(() => meResponse.value?.data ?? null)
const profile = computed(() => user.value?.profile ?? null)

const formatDate = (dateStr: string | null): string => {
  if (!dateStr)
    return 'N/A'

  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="min-h-screen bg-brand-dark text-slate-100 font-sans antialiased">
    <AppTopNav />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="isLoading" class="space-y-6">
        <div class="rounded-xl border border-slate-800 bg-brand-bg p-8 animate-pulse space-y-4">
          <div class="h-8 bg-slate-700 rounded w-1/3" />
          <div class="h-4 bg-slate-700 rounded w-1/2" />
        </div>
      </div>

      <div v-else-if="user" class="space-y-6">
        <div class="rounded-xl border border-slate-800 bg-gradient-to-b from-brand-bg to-brand-deep p-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/20">
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <h1 class="text-2xl font-black text-white tracking-tight">
                  {{ user.name }}
                </h1>
                <p class="text-sm text-slate-400">
                  {{ user.email }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                    {{ user.role }}
                  </span>
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border"
                    :class="user.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'"
                  >
                    {{ user.status }}
                  </span>
                </div>
              </div>
            </div>

            <NuxtLink
              to="/profile/setup"
              class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-bold transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              <UIcon name="i-heroicons-pencil-square" class="h-4 w-4" />
              Edit Profile
            </NuxtLink>
          </div>
        </div>

        <div v-if="profile" class="rounded-xl border border-slate-800 bg-gradient-to-b from-brand-bg to-brand-deep p-8 space-y-6">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <UIcon name="i-heroicons-identification" class="h-5 w-5 text-blue-400" />
            Academic Profile
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <p class="text-sm font-semibold text-white">
                {{ profile.full_name || 'Not set' }}
              </p>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">University ID</label>
              <p class="text-sm font-semibold text-white">
                {{ profile.university_id || 'Not set' }}
              </p>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
              <p class="text-sm font-semibold text-white">
                {{ profile.department || 'Not set' }}
              </p>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Academic Year</label>
              <p class="text-sm font-semibold text-white">
                {{ profile.academic_year || 'Not set' }}
              </p>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Skills</label>
            <div v-if="profile.skills && profile.skills.length > 0" class="flex flex-wrap gap-2">
              <span
                v-for="skill in profile.skills"
                :key="skill"
                class="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20"
              >
                {{ skill }}
              </span>
            </div>
            <p v-else class="text-sm text-slate-500">
              No skills added yet.
            </p>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Bio</label>
            <p class="text-sm text-slate-300 leading-relaxed bg-brand-dark/50 rounded-lg p-4 border border-slate-800">
              {{ profile.bio || 'No bio provided.' }}
            </p>
          </div>
        </div>

        <div v-else class="rounded-xl border border-slate-800 bg-gradient-to-b from-brand-bg to-brand-deep p-8 text-center">
          <UIcon name="i-heroicons-user-circle" class="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h3 class="text-lg font-bold text-white mb-1">
            Profile Incomplete
          </h3>
          <p class="text-sm text-slate-400 mb-4">
            You haven't completed your academic profile yet.
          </p>
          <NuxtLink
            to="/profile/setup"
            class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-bold transition-all cursor-pointer"
          >
            Complete Profile
          </NuxtLink>
        </div>

        <div class="rounded-xl border border-slate-800 bg-gradient-to-b from-brand-bg to-brand-deep p-6">
          <div class="flex flex-wrap gap-6 text-sm">
            <div class="flex items-center gap-2 text-slate-400">
              <UIcon name="i-heroicons-calendar" class="h-4 w-4" />
              <span>Joined: <span class="text-slate-200 font-medium">{{ formatDate(user.created_at) }}</span></span>
            </div>
            <div class="flex items-center gap-2 text-slate-400">
              <UIcon name="i-heroicons-clock" class="h-4 w-4" />
              <span>Last Login: <span class="text-slate-200 font-medium">{{ formatDate(user.last_login_at) }}</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>