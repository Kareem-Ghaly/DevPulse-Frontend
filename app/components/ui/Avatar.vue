<script setup lang="ts">

interface Props {
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  gradient?: string
  showStar?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  gradient: 'from-blue-500 to-indigo-600',
})

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-sm',
  xl: 'h-14 w-14 text-base',
}
</script>

<template>
  <div class="relative flex-shrink-0">
    <div
      class="rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold shadow-lg"
      :class="[sizeClasses[size], gradient]"
    >
      {{ getInitials(name) }}
    </div>
    <div
      v-if="showStar"
      class="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-purple-600 border-2 border-brand-dark flex items-center justify-center"
    >
      <UIcon name="i-heroicons-star" class="h-2.5 w-2.5 text-white" />
    </div>
  </div>
</template>