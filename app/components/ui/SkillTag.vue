<script setup lang="ts">

interface Props {
  skill: string
}

const props = defineProps<Props>()

const classes = computed(() => getSkillClasses(props.skill))
</script>

<template>
  <span class="px-3 py-1.5 rounded-lg text-xs font-semibold border" :class="classes">
    {{ skill }}
  </span>
</template>