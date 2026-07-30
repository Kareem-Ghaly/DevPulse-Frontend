<script setup lang="ts">
import KanbanColumn from './KanbanColumn.vue'
import type { KanbanColumn as KanbanColumnType } from '~/composables/useTask/useTaskBoard'

interface Props {
  columns: KanbanColumnType[]
  isLoading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  addTask: [columnId: string]
  taskClick: [taskId: number]
  taskMove: [taskId: number, newStatus: string, oldStatus: string]
}>()

interface DraggedTask {
  taskId: number
  oldStatus: string
}

const draggedTask = ref<DraggedTask | null>(null)

const handleDragStart = (taskId: number, oldStatus: string): void => {
  draggedTask.value = { taskId, oldStatus }
}

const handleDragOver = (e: DragEvent): void => {
  e.preventDefault()
}

const handleDrop = (e: DragEvent, columnId: string): void => {
  e.preventDefault()
  if (!draggedTask.value) return

  const { taskId, oldStatus } = draggedTask.value
  if (oldStatus !== columnId) {
    emit('taskMove', taskId, columnId, oldStatus)
  }
  draggedTask.value = null
}

const handleDragEnd = (): void => {
  draggedTask.value = null
}
</script>

<template>
  <div class="flex-1 p-3 md:p-6 overflow-x-auto overflow-y-hidden">
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin text-slate-500" />
    </div>

    <div v-else class="flex gap-3 md:gap-4 min-w-max h-full pb-2">
      <KanbanColumn
        v-for="column in props.columns"
        :key="column.id"
        :column="column"
        :is-drag-over="draggedTask?.oldStatus !== column.id"
        @dragover="handleDragOver"
        @drop="(e: DragEvent) => handleDrop(e, column.id)"
        @add-task="(columnId: string) => emit('addTask', columnId)"
        @task-click="(taskId: number) => emit('taskClick', taskId)"
        @task-drag-start="(taskId: number) => handleDragStart(taskId, column.id)"
        @task-drag-end="handleDragEnd"
      />
    </div>
  </div>
</template>