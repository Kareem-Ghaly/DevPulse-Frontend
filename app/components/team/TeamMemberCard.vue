<script setup lang="ts">
import AppTopNav from '../layout/AppTopNav.vue';


interface Props {
  match: Match
}

const props = defineProps<Props>()

const emit = defineEmits<{
  invite: [receiverId: number]
}>()

const initials = computed(() => getInitials(props.match.student.name))
</script>

<template>
  <div class="bg-panel-dark border border-border-dark rounded-xl p-5 flex flex-col gap-4 hover:border-slate-600 transition-colors">
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="relative">
          <div class="h-10 w-10 rounded-full bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center text-sm font-bold text-brand-purple">
            {{ initials }}
          </div>
          <div
            v-if="match.match_percentage >= 60"
            class="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-panel-dark"
          />
        </div>

        <div>
          <p class="text-sm font-semibold text-white leading-tight">{{ match.student.name }}</p>
          <p class="text-xs text-slate-500 mt-0.5">{{ match.student.email }}</p>
        </div>
      </div>

      <div class="sm:flex block items-center gap-1.5">
        <UIcon name="i-heroicons-bolt" class="h-3.5 w-3.5" :class="getMatchTextColor(match.match_percentage)" />
        <span class="text-sm font-bold" :class="getMatchTextColor(match.match_percentage)">
          {{ match.match_percentage }}%
        </span>
        <span class="text-xs text-slate-500">match</span>
      </div>
    </div>

    <div class="w-full h-1 rounded-full bg-border-dark overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-500"
        :class="getMatchBgColor(match.match_percentage)"
        :style="{ width: `${match.match_percentage}%` }"
      />
    </div>

    <div class="flex flex-col gap-2">
      <div v-if="match.matched_skills.length">
        <p class="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Matched Skills</p>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="skill in match.matched_skills"
            :key="skill"
            class="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-xs"
          >
            {{ skill }}
          </span>
        </div>
      </div>

      <div v-if="match.missing_skills.length">
        <p class="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Missing Skills</p>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="skill in match.missing_skills"
            :key="skill"
            class="px-2 py-0.5 bg-red-500/10 border-red-500/20 text-red-300 rounded text-xs"
          >
            {{ skill }}
          </span>
        </div>
        <slot name="action"/>
      </div>
    </div>
  </div>
</template>