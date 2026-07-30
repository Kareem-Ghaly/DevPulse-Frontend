<script setup lang="ts">
interface Props {
  rows?: number
  columns?: number
}

withDefaults(defineProps<Props>(), {
  rows: 1,
  columns: 3,
})
</script>

<template>
  <div class="animate-pulse space-y-6">
    <div class="h-8 bg-slate-800 rounded w-1/3" />
    <div class="h-4 bg-slate-800 rounded w-1/2" />
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-4">
        <div class="h-64 bg-slate-800 rounded-xl" />
        <div class="h-48 bg-slate-800 rounded-xl" />
      </div>
      <div class="space-y-4">
        <div class="h-48 bg-slate-800 rounded-xl" />
        <div class="h-48 bg-slate-800 rounded-xl" />
      </div>
    </div>
  </div>
</template>