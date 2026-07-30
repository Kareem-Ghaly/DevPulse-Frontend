<script setup lang="ts">
interface Props {
  match: SupervisorMatch
  isSubmitting: boolean
  isSelected: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  select: [supervisorId: number]
}>()
</script>

<template>
  <div class="bg-panel-dark border border-border-dark rounded-xl py-4 px-2 md:p-6 hover:border-brand-purple/30 transition-all">
    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div class="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
        <div class="h-10 w-10 md:h-12 md:w-12 rounded-full bg-brand-purple/20 flex items-center justify-center shrink-0">
          <span class="text-base md:text-lg font-bold text-brand-purple">
            {{ match.supervisor.name.charAt(0) }}
          </span>
        </div>

        <div class="min-w-0 flex-1">
          <h3 class="text-xs md:text-base font-semibold text-white mb-1 truncate">
            {{ match.supervisor.name }}
          </h3>
          <p class="text-[11px] md:text-xs text-slate-400 mb-1">
            {{ match.supervisor.academic_title }} • {{ match.supervisor.specialization }}
          </p>
          <p class="text-[11px] md:text-xs text-slate-500 truncate">
            {{ match.supervisor.email }}
          </p>

          <div class="flex flex-wrap gap-1.5 mt-3">
            <span
              v-for="interest in match.matched_interests"
              :key="interest"
              class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            >
              {{ interest }}
            </span>
            <span
              v-for="interest in match.missing_interests"
              :key="interest"
              class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-500/10 text-slate-500 border border-slate-700/50"
            >
              {{ interest }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3 w-full md:w-auto md:min-w-[140px]">
        <div class="flex flex-row md:flex-col items-center md:items-end gap-3">
          <div
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg border shrink-0"
            :class="getMatchColor(match.match_percentage)"
          >
            <UIcon name="i-heroicons-check-circle" class="h-4 w-4" />
            <span class="text-xs font-bold">{{ match.match_percentage }}% Match</span>
          </div>

          <div class="flex-1 md:w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden max-w-[200px] md:max-w-none">
            <div
              class="h-full rounded-full transition-all"
              :class="getMatchBarColor(match.match_percentage)"
              :style="{ width: `${match.match_percentage}%` }"
            />
          </div>
        </div>

        <button
          class="flex items-center justify-center gap-1.5 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-medium px-4 py-2.5 md:py-2 rounded-lg transition-colors disabled:opacity-50 w-full"
          :disabled="isSubmitting && isSelected"
          @click="emit('select', match.supervisor.id)"
        >
          <UIcon
            v-if="isSubmitting && isSelected"
            name="i-heroicons-arrow-path"
            class="h-3.5 w-3.5 animate-spin"
          />
          <UIcon v-else name="i-heroicons-paper-airplane" class="h-3.5 w-3.5" />
          {{ isSubmitting && isSelected ? 'Sending...' : 'Send Request' }}
        </button>
      </div>
    </div>
  </div>
</template>