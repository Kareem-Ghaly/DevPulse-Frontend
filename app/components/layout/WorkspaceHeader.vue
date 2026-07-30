<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  showBack?: boolean
  backTo?: string
}

const props = withDefaults(defineProps<Props>(), {
  showBack: true,
})

const router = useRouter()

const goBack = () => {
  if (props.backTo) router.push(props.backTo)
  else router.back()
}
</script>

<template>
  <header class="h-14 border-b border-border-dark px-3 md:px-6 flex items-center justify-between bg-brand-deep sticky top-0 z-10">
    <div class="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
      <button
        v-if="showBack"
        class="text-slate-400 hover:text-white transition-colors shrink-0 p-1 rounded-lg hover:bg-slate-800/50"
        @click="goBack"
      >
        <UIcon name="i-heroicons-arrow-left" class="h-4 w-4" />
      </button>
      <div class="min-w-0">
        <h1 class="text-xs md:text-sm font-bold text-white truncate">{{ title }}</h1>
        <p v-if="subtitle" class="text-[10px] md:text-[11px] text-slate-500 truncate hidden sm:block">{{ subtitle }}</p>
      </div>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <slot />
    </div>
  </header>
</template>