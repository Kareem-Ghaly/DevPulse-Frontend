<script setup lang="ts">
interface Props {
  icon?: string
  title: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'i-heroicons-folder-open',
})
</script>

<template>
  <div class="text-center py-16">
    <div class="h-16 w-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
      <UIcon :name="icon" class="h-8 w-8 text-slate-600" />
    </div>
    <h3 class="text-sm font-bold text-slate-400 mb-1">{{ title }}</h3>
    <p v-if="description" class="text-xs text-slate-600">{{ description }}</p>
  </div>
</template>