<script setup lang="ts">
interface Props {
  isInvited: boolean
  isSending: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    class="flex items-center gap-1.5 px-4 mt-5 mb-2 w-full py-2 rounded-lg text-xs font-medium transition-all flex-1 justify-center"
    :class="
      isInvited
        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-default'
        : isSending
          ? 'bg-brand-purple/50 text-white/60 cursor-not-allowed'
          : 'bg-brand-purple hover:bg-brand-purple-hover text-white cursor-pointer'
    "
    :disabled="isInvited || isSending"
    @click="emit('click')"
  >
    <UIcon
      v-if="isSending"
      name="i-heroicons-arrow-path"
      class="h-3.5 w-3.5 animate-spin"
    />
    <UIcon
      v-else-if="isInvited"
      name="i-heroicons-check"
      class="h-3.5 w-3.5"
    />
    <UIcon
      v-else
      name="i-heroicons-paper-airplane"
      class="h-3.5 w-3.5"
    />
    <span>
      {{ isSending ? 'Sending...' : isInvited ? 'Invited' : 'Send' }}
    </span>
  </button>
</template>