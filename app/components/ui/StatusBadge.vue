<script setup lang="ts">

interface Props {
  status: string
}

const props = defineProps<Props>()

const config = computed(() => STATUS_CONFIG[props.status])
</script>

<template>
  <span
    v-if="config"
    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10"
    :class="[config.bg, config.color]"
  >
    <span class="h-1.5 w-1.5 rounded-full" :class="config.dot" />
    {{ config.label }}
  </span>
  <span v-else class="text-xs text-slate-400">{{ status }}</span>
</template>