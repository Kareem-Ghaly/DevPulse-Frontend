<script setup lang="ts">
interface Props {
  title?: string
  icon?: string
  iconColor?: string
  iconBg?: string
}

withDefaults(defineProps<Props>(), {
  iconColor: 'text-blue-400',
  iconBg: 'bg-blue-500/10',
})
</script>

<template>
  <div class="rounded-xl border border-slate-800 bg-gradient-to-b from-brand-bg to-brand-deep p-6">
    <div v-if="title" class="flex items-center gap-2 mb-4">
      <div v-if="icon" class="p-1.5 rounded-lg" :class="iconBg">
        <UIcon :name="icon" class="h-4 w-4" :class="iconColor" />
      </div>
      <h2 class="text-sm font-bold text-white uppercase tracking-wider">{{ title }}</h2>
    </div>
    <slot />
  </div>
</template>