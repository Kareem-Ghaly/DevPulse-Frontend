<script setup lang="ts">

interface Props {
  column: TaskColumn
}

defineProps<Props>()

const emit = defineEmits<{
  addTask: [columnId: string]
  taskClick: [taskId: number]
}>()

const showAddInput = ref(false)
const newTitle = ref('')

const submit = () => {
  if (!newTitle.value.trim()) return
  emit('addTask', id)
  newTitle.value = ''
  showAddInput.value = false
}
</script>

<template>
  <div class="w-72 flex flex-col">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <span class="h-2 w-2 rounded-full" :class="column.color" />
        <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider">{{ column.title }}</h3>
        <span class="text-xs text-slate-500">{{ column.tasks.length }}</span>
      </div>
      <button
        class="text-slate-500 hover:text-white transition-colors"
        @click="showAddInput = !showAddInput"
      >
        <UIcon name="i-heroicons-plus" class="h-4 w-4" />
      </button>
    </div>

    <div v-if="showAddInput" class="mb-3">
      <input
        v-model="newTitle"
        type="text"
        placeholder="Enter task title..."
        class="w-full bg-panel-dark border border-border-dark rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
        autofocus
        @keydown.enter="submit"
        @blur="showAddInput = false"
      >
    </div>

    <div class="flex-1 space-y-2">
      <TaskCard
        v-for="task in column.tasks"
        :key="task.id"
        :task="task"
        @click="emit('taskClick', task.id)"
      />

      <div v-if="column.tasks.length === 0" class="flex flex-col items-center justify-center py-8 text-center">
        <p class="text-xs text-slate-600">No tasks yet</p>
      </div>
    </div>
  </div>
</template>