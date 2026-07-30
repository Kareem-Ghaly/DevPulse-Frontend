<script setup lang="ts">

interface Props {
  project: ProjectIdea
}

const props = defineProps<Props>()
</script>

<template>
  <AppCard title="Project Details" icon="i-heroicons-document-text">
    <p class="text-sm text-slate-300 leading-relaxed mb-4 break-all line-clamp-1">
      {{ props.project.description }}
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
      <div class="p-3 rounded-lg bg-brand-dark/60 border border-slate-800">
        <div class="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <UIcon name="i-heroicons-users" class="h-3.5 w-3.5" />
          Team Size
        </div>
        <p class="text-lg font-bold text-white">{{ props.project.team_size }}</p>
      </div>
      <div class="p-3 rounded-lg bg-brand-dark/60 border border-slate-800">
        <div class="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <UIcon name="i-heroicons-calendar" class="h-3.5 w-3.5" />
          Created
        </div>
        <p class="text-sm font-bold text-white">{{ formatDate(props.project.created_at) }}</p>
      </div>
      
    </div>

    <div>
      <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Required Skills</p>
      <div class="flex flex-wrap gap-2">
        <SkillTag v-for="skill in props.project.required_skills" :key="skill" :skill="skill" />
      </div>
    </div>
  </AppCard>
</template>