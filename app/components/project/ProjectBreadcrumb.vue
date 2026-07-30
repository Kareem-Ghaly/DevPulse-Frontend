<script setup lang="ts">
interface Props {
  title: string
  backTo?: string
}

withDefaults(defineProps<Props>(), {
  backTo: '/student/my-projects',
})
</script>

<template>
  <div class="flex items-center gap-2 text-xs text-slate-500 mb-6">
    <NuxtLink :to="backTo" class="hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer">
      <UIcon name="i-heroicons-home" class="h-3.5 w-3.5" />
      My Projects
    </NuxtLink>
    <UIcon name="i-heroicons-chevron-right" class="h-3 w-3" />
    <span class="text-slate-300 truncate max-w-[200px]">{{ title }}</span>
  </div>
</template>