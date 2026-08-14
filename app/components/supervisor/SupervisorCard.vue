<script setup lang="ts">
const props = withDefaults(defineProps<{
  match?: any
  isSelected?: boolean
  isSubmitting?: boolean
}>(), {
  match: () => ({}),
  isSelected: false,
  isSubmitting: false,
})

const emit = defineEmits<{ select: [id: number] }>()

const s = computed(() => props.match?.supervisor ?? {})
const deptMatch = computed(() => props.match?.department_match ?? false)
const percentage = computed(() => props.match?.match_percentage ?? 0)
const matched = computed(() => props.match?.matched_skills ?? [])
const missing = computed(() => props.match?.missing_skills ?? [])
const interests = computed(() => props.match?.supervisor_research_interests ?? [])

const initials = (name?: string) => {
  if (!name) return '??'
  
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const color = (p: number) => p >= 70 ? 'text-emerald-400' : p >= 40 ? 'text-amber-400' : 'text-slate-400'
const bg = (p: number) => p >= 70 ? 'bg-emerald-500/10 border-emerald-500/20' : p >= 40 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-slate-500/10 border-slate-500/20'
const bar = (p: number) => p >= 70 ? 'bg-emerald-500' : p >= 40 ? 'bg-amber-500' : 'bg-slate-600'

const onSelect = () => {
  if (s.value?.id) emit('select', s.value.id)
}
</script>

<template>
  <div
    class="relative group bg-panel-dark border rounded-xl p-5 md:p-6 transition-all"
    :class="isSelected ? 'border-brand-purple shadow-[0_0_20px_rgba(139,92,246,0.15)]' : 'border-border-dark hover:border-slate-600'"
  >
    <div v-if="isSelected" class="absolute -top-px -right-px h-8 w-8 bg-brand-purple rounded-bl-xl rounded-tr-xl flex items-center justify-center">
      <UIcon name="i-heroicons-check" class="h-4 w-4 text-white" />
    </div>

    <div class="flex items-start gap-4 mb-5">
      <div class="h-14 w-14 rounded-xl flex items-center justify-center text-lg font-bold shrink-0" :class="bg(percentage)">
        <span :class="color(percentage)">{{ initials(s.name) }}</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap mb-1">
          <h3 class="text-base font-bold text-white truncate">{{ s.name || 'Unknown' }}</h3>
          <span v-if="deptMatch" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
            <UIcon name="i-heroicons-building-office" class="h-3 w-3" />
            Same Dept
          </span>
        </div>
        <p class="text-xs text-slate-400 mb-0.5">{{ s.academic_title || 'N/A' }} • {{ s.department || 'N/A' }}</p>
        <p class="text-xs text-slate-500 truncate">{{ s.email || '' }}</p>
      </div>
    </div>

    <div class="flex items-center gap-4 mb-5 p-3 rounded-lg bg-brand-deep/50 border border-border-dark">
      <div class="relative h-14 w-14 shrink-0">
        <svg class="h-14 w-14 -rotate-90" viewBox="0 0 36 36">
          <path class="text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3" />
          <path :class="bar(percentage)" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3" :stroke-dasharray="`${percentage}, 100`" stroke-linecap="round" />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-sm font-bold text-white">{{ percentage }}%</span>
        </div>
      </div>
      <div>
        <p class="text-xs font-bold text-slate-300">Match Score</p>
        <p class="text-[10px] text-slate-500">
          {{ matched.length }} matched • {{ missing.length }} missing
        </p>
      </div>
    </div>

    <div v-if="interests.length" class="mb-4">
      <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Supervisor Interests</p>
      <div class="flex flex-wrap gap-1.5">
        <span v-for="i in interests" :key="i" class="px-2 py-1 rounded-md text-[10px] font-semibold border bg-blue-500/5 text-blue-400 border-blue-500/15">{{ i }}</span>
      </div>
    </div>

    <div class="mb-5 space-y-3">
      <div v-if="matched.length" class="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
        <p class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">Matched Skills</p>
        <div class="flex flex-wrap gap-1.5">
          <span v-for="skill in matched" :key="skill" class="px-2 py-1 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{{ skill }}</span>
        </div>
      </div>

      <div v-if="missing.length" class="p-3 rounded-lg bg-rose-500/5 border border-rose-500/10">
        <p class="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-2">Missing Skills</p>
        <div class="flex flex-wrap gap-1.5">
          <span v-for="skill in missing" :key="skill" class="px-2 py-1 rounded-md text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">{{ skill }}</span>
        </div>
      </div>
    </div>

    <button
      class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
      :class="isSelected ? 'bg-brand-purple/20 text-brand-purple border border-brand-purple/30' : 'bg-brand-purple hover:bg-brand-purple-hover text-white'"
      :disabled="isSubmitting"
      @click="onSelect"
    >
      <UIcon v-if="isSubmitting && isSelected" name="i-heroicons-arrow-path" class="h-4 w-4 animate-spin" />
      <UIcon v-else-if="isSelected" name="i-heroicons-check" class="h-4 w-4" />
      <UIcon v-else name="i-heroicons-plus" class="h-4 w-4" />
      {{ isSelected ? 'Selected' : 'Select Supervisor' }}
    </button>
  </div>
</template>