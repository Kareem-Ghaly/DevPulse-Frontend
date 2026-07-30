<script setup lang="ts">

interface Props {
  title: string
  abstract: string
  status: string
}

const props = defineProps<Props>()

const router = useRouter()
</script>

<template>
  <div class="flex flex-col lg:flex-row lg:items-start  lg:justify-between gap-4 mb-8">
    <div>
      <h1 class="text-2xl lg:text-3xl font-black text-white tracking-tight break-all line-clamp-1">
        {{ props.title }}
      </h1>
      <p class="text-sm text-slate-400 mt-1 break-all line-clamp-1">{{ props.abstract }}</p>
    </div>
    <div class="flex items-center gap-3 flex-wrap">
      <StatusBadge :status="props.status" />
      <NuxtLink
        to="/student/my-projects"
        class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-dark border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
      >
        <UIcon name="i-heroicons-arrow-left" class="h-3.5 w-3.5" />
        Back
      </NuxtLink>
    </div>
  </div>
</template>