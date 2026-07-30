<script setup lang="ts">

interface Props {
  team: Team
  project: ProjectIdea
  isTeamComplete: boolean 
}

const props = defineProps<Props>()

const emit = defineEmits<{
  invite: []
  goToKanban: []
}>()

</script>

<template>
  <div class="rounded-xl border border-slate-800 bg-gradient-to-b from-brand-bg to-brand-deep p-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <div class="p-1.5 rounded-lg bg-indigo-500/10">
          <UIcon name="i-heroicons-users" class="h-4 w-4 text-indigo-400" />
        </div>
        <h2 class="font-bold text-white uppercase tracking-wider">Team Members</h2>
      </div>
      <span class="text-slate-500">{{ team.members.length }} / {{ project.team_size }}</span>
    </div>

    <div class="space-y-3">
      <div
        v-for="member in team.members"
        :key="member.id"
        class="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-brand-dark/50 hover:bg-brand-dark/70 transition-colors"
      >

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <h3 class="font-bold text-white truncate">{{ member.user.name }}</h3>
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border"
              :class="MEMBER_ROLE_CONFIG[member.role]?.bg + ' ' + MEMBER_ROLE_CONFIG[member.role]?.color + ' border-white/5'"
            >
              <UIcon :name="MEMBER_ROLE_CONFIG[member.role]?.icon || 'i-heroicons-user'" class="h-3 w-3" />
              {{ MEMBER_ROLE_CONFIG[member.role]?.label || member.role }}
            </span>
          </div>
          <p class="text-sm text-slate-400 mb-1">{{ member.email }}</p>


          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="skill in member.user.profile.skills"
              :key="skill"
              class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-700/50"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <UIcon v-if="member.role === 'leader'" name="i-heroicons-crown" class="h-5 w-5 text-purple-400 flex-shrink-0 mt-1" />
      </div>
    </div>

    <button
      v-if="team.members.length != project.team_size"
      class="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-slate-700  font-semibold text-slate-500 hover:text-white hover:border-brand-purple hover:bg-brand-purple/10 transition-all cursor-pointer"
      @click="emit('invite')"
    >
      <UIcon name="i-heroicons-user-plus" class="h-4 w-4" />
      Invite Team Member
    </button>

    <button
      v-else
      class="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600/20 border border-emerald-500/30 font-semibold text-emerald-400 hover:bg-emerald-600/30 transition-all cursor-pointer"
      @click="emit('goToKanban')"
    >
      <UIcon name="i-heroicons-view-columns" class="h-4 w-4" />
      Go to Kanban Board
    </button>
  </div>
</template>