<script setup lang="ts">
interface Props {
  currentMembers: number
  teamSize: number
}

const props = defineProps<Props>()

const percentage = computed(() => (props.currentMembers / props.teamSize) * 100)
</script>

<template>
  <div class="rounded-xl border border-slate-800 bg-gradient-to-b from-brand-bg to-brand-deep p-6">
    <h2 class="text-sm font-bold text-white uppercase tracking-wider mb-3">Team Completion</h2>
    <div class="relative h-2 rounded-full bg-slate-800 overflow-hidden">
      <div
        class="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
        :style="{ width: percentage + '%' }"
      />
    </div>
    <p class="text-xs text-slate-400 mt-2">
      {{ currentMembers }} of {{ teamSize }} members joined
    </p>
  </div>
</template>