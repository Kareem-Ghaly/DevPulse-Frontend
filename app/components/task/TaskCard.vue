<script setup lang="ts">
import type { Task } from '~/composables/useTask/useTaskBoard'

interface Props {
  task: Task
}

defineProps<Props>()

const emit = defineEmits<{
  click: [taskId: number]
  dragstart: [taskId: number]
  dragend: []
}>()

const priorityColors: Record<string, string> = {
  high: 'bg-rose-500',
  medium: 'bg-amber-500',
  low: 'bg-blue-500',
}

const priorityLabels: Record<string, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}
</script>

<template>
  <div
    class="bg-panel-dark border border-border-dark rounded-lg p-3 md:p-4 cursor-pointer hover:border-slate-600 transition-all active:scale-[0.98] select-none"
    draggable="true"
    v-bind="$attrs"
    @click="emit('click', task.id)"
    @dragstart="emit('dragstart', task.id)"
    @dragend="emit('dragend')"
  >
    <p class="text-xs text-slate-200 font-medium leading-relaxed break-all line-clamp-1">{{ task.title }}</p>

    <div class="mt-2 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div v-if="task.priority" class="flex items-center gap-1">
          <span
            class="h-1.5 w-1.5 rounded-full"
            :class="priorityColors[task.priority] || 'bg-slate-500'"
          />
          <span class="text-[10px] text-slate-500 capitalize">
            {{ priorityLabels[task.priority] || task.priority }}
          </span>
        </div>

        <div v-if="task.assigned_user" class="flex items-center gap-1">
          <div class="h-4 w-4 rounded-full bg-brand-purple/20 flex items-center justify-center">
            <span class="text-[8px] text-brand-purple font-bold">
              {{ task.assigned_user.name.charAt(0).toUpperCase() }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-1.5">
        <div v-if="task.attachments?.length" class="flex items-center gap-0.5 text-slate-600">
          <UIcon name="i-heroicons-paper-clip" class="h-3 w-3" />
          <span class="text-[10px]">{{ task.attachments.length }}</span>
        </div>
        <div v-if="task.links?.length" class="flex items-center gap-0.5 text-slate-600">
          <UIcon name="i-heroicons-link" class="h-3 w-3" />
          <span class="text-[10px]">{{ task.links.length }}</span>
        </div>
      </div>
    </div>

    <div v-if="task.due_date" class="mt-2 flex items-center gap-1 text-slate-600">
      <UIcon name="i-heroicons-calendar" class="h-3 w-3" />
      <span class="text-[10px]">{{ new Date(task.due_date).toLocaleDateString() }}</span>
    </div>
  </div>
</template>