<script setup lang="ts">
import TaskCard from './TaskCard.vue'
import type { KanbanColumn } from '~/composables/useTask/useTaskBoard'

interface Props {
  column: KanbanColumn
  isDragOver?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  addTask: [columnId: string]
  taskClick: [taskId: number]
  taskDragStart: [taskId: number]
  taskDragEnd: []
  dragover: [e: DragEvent]
  drop: [e: DragEvent]
}>()

const handleAddClick = (): void => {
  emit('addTask', props.column.id)
}
</script>

<template>
  <div
    class="w-[85vw] sm:w-72 flex flex-col min-h-[200px] shrink-0"
    @dragover="$emit('dragover', $event)"
    @drop="$emit('drop', $event)"
  >
    <div class="flex items-center justify-between mb-2 md:mb-3 px-1">
      <div class="flex items-center gap-2 min-w-0">
        <span class="h-2 w-2 rounded-full shrink-0" :class="column.color" />
        <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider truncate">
          {{ column.title }}
        </h3>
        <span class="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full shrink-0">
          {{ column.tasks.length }}
        </span>
      </div>
      <button
        class="text-slate-500 hover:text-white transition-colors p-1.5 md:p-1 rounded hover:bg-slate-800 shrink-0"
        @click="handleAddClick"
      >
        <UIcon name="i-heroicons-plus" class="h-4 w-4" />
      </button>
    </div>

    <div class="flex-1 space-y-2 md:space-y-3 min-h-[100px] overflow-y-auto overflow-x-hidden pr-1">
      <TaskCard
        v-for="task in column.tasks"
        :key="task.id"
        :task="task"
        draggable="true"
        @click="emit('taskClick', task.id)"
        @dragstart="emit('taskDragStart', task.id)"
        @dragend="emit('taskDragEnd')"
      />

      <div
        v-if="column.tasks.length === 0"
        class="flex flex-col items-center justify-center py-6 md:py-8 text-center border-2 border-dashed border-slate-800 rounded-lg"
      >
        <UIcon name="i-heroicons-inbox" class="h-6 w-6 text-slate-700 mb-2" />
        <p class="text-xs text-slate-600">Drop tasks here</p>
      </div>
    </div>
  </div>
</template>