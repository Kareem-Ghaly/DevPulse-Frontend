<script setup lang="ts">
import SupervisorNavbar from '~/components/task/SupervisorNavbar.vue'
import type { Task } from '~/types/supervisor.types'

const route = useRoute()
const teamId = computed(() => route.params.id as string)

const { tasks, isLoading, isSubmitting, fetchTasks, reviewTask, getTasksByStatus } = useSupervisorTasks(teamId)

onMounted(() => {
  fetchTasks()
})

const activeStatus = ref<Task['status']>('backlog')

const statusOptions: { value: Task['status']; label: string; icon: string; color: string }[] = [
  { value: 'backlog', label: 'Backlog', icon: 'i-heroicons-circle-stack', color: 'text-slate-400' },
  { value: 'todo', label: 'To Do', icon: 'i-heroicons-clipboard', color: 'text-blue-400' },
  { value: 'in_progress', label: 'In Progress', icon: 'i-heroicons-arrow-path', color: 'text-amber-400' },
  { value: 'done', label: 'Done', icon: 'i-heroicons-check-circle', color: 'text-emerald-400' },
]

const filteredTasks = computed(() => getTasksByStatus(activeStatus.value))

const selectedTask = ref<Task | null>(null)
const showReviewModal = ref(false)
const reviewText = ref('')

const openReview = (task: Task) => {
  selectedTask.value = task
  reviewText.value = task.latest_review?.review || ''
  showReviewModal.value = true
}

const submitReview = async () => {
  if (!selectedTask.value) return

  await reviewTask(selectedTask.value.id, reviewText.value)
  showReviewModal.value = false
  selectedTask.value = null
  reviewText.value = ''
}

const priorityClass = (priority: Task['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-500/10 text-red-400'
    case 'high':
      return 'bg-orange-500/10 text-orange-400'
    case 'medium':
      return 'bg-amber-500/10 text-amber-400'
    case 'low':
      return 'bg-slate-500/10 text-slate-400'
    default:
      return 'bg-slate-500/10 text-slate-400'
  }
}

const formatDate = (date: string | null) => {
  if (!date) return '-'
  
  return new Date(date).toLocaleDateString()
}
</script>

<template>
  <div class="min-h-screen bg-brand-deep text-slate-100">
    <SupervisorNavbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-black text-white tracking-tight">
            Supervised Tasks
          </h1>
          <p class="text-slate-400 text-sm mt-1">
            Review and manage tasks for your supervised projects
          </p>
        </div>
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-dark border border-border-dark text-sm font-bold text-slate-300 hover:text-white hover:border-border-slate transition-colors cursor-pointer"
          @click="fetchTasks"
        >
          <UIcon name="i-heroicons-arrow-path" :class="['h-4 w-4', isLoading && 'animate-spin']" />
          Refresh
        </button>
      </div>

      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          v-for="status in statusOptions"
          :key="status.value"
          class="px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
          :class="activeStatus === status.value ? 'bg-brand-purple text-white' : 'bg-brand-dark text-slate-400 hover:text-white border border-border-dark'"
          @click="activeStatus = status.value"
        >
          <UIcon :name="status.icon" class="h-4 w-4" />
          {{ status.label }}
          <span class="text-xs opacity-70">
            ({{ getTasksByStatus(status.value).length }})
          </span>
        </button>
      </div>

      <div v-if="isLoading" class="text-center py-12 text-slate-400">
        <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin mx-auto mb-3" />
        <p>Loading tasks...</p>
      </div>

      <div v-else-if="filteredTasks.length === 0" class="text-center py-12">
        <UIcon name="i-heroicons-clipboard-document-list" class="h-12 w-12 mx-auto mb-3 text-slate-600" />
        <h3 class="text-lg font-bold text-white mb-1">
          No tasks found
        </h3>
        <p class="text-slate-400 text-sm">
          There are no tasks in {{ activeStatus }} status.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="bg-panel-dark border border-border-dark rounded-xl p-5 hover:border-brand-purple/30 transition-colors"
        >
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-base font-bold text-white truncate pr-4">
              {{ task.title }}
            </h3>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap"
              :class="priorityClass(task.priority)"
            >
              {{ task.priority }}
            </span>
          </div>

          <p v-if="task.description" class="text-xs text-slate-400 mb-3 line-clamp-2">
            {{ task.description }}
          </p>

          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <UIcon name="i-heroicons-user" class="h-3.5 w-3.5" />
              <span>
                Assigned to: {{ task.assigned_user?.name || 'Unassigned' }}
              </span>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <UIcon name="i-heroicons-user-circle" class="h-3.5 w-3.5" />
              <span>Created by: {{ task.creator.name }}</span>
            </div>
            <div v-if="task.due_date" class="flex items-center gap-2 text-xs text-slate-400">
              <UIcon name="i-heroicons-calendar" class="h-3.5 w-3.5" />
              <span>Due: {{ formatDate(task.due_date) }}</span>
            </div>
          </div>

          <div v-if="task.attachments.length > 0" class="mb-4">
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Attachments</p>
            <div class="flex flex-wrap gap-2">
              <a
                v-for="attachment in task.attachments"
                :key="attachment.id"
                :href="attachment.file_url"
                target="_blank"
                class="flex items-center gap-1.5 px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 hover:text-white transition-colors"
              >
                <UIcon name="i-heroicons-paper-clip" class="h-3 w-3" />
                {{ attachment.file_name }}
              </a>
            </div>
          </div>

          <div v-if="task.latest_review" class="mb-4 p-3 bg-brand-purple/5 border border-brand-purple/20 rounded-lg">
            <p class="text-[10px] font-bold text-brand-purple uppercase tracking-widest mb-1">Latest Review</p>
            <p class="text-xs text-slate-300 whitespace-pre-line">{{ task.latest_review.review }}</p>
            <p class="text-[10px] text-slate-500 mt-1">
              By {{ task.latest_review.supervisor.name }} • {{ formatDate(task.latest_review.reviewed_at) }}
            </p>
          </div>

          <div class="flex items-center gap-2 pt-3 border-t border-border-dark">
            <button
              class="flex-1 bg-brand-purple/20 hover:bg-brand-purple/30 text-brand-purple text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer"
              @click="openReview(task)"
            >
              {{ task.latest_review ? 'Update Review' : 'Add Review' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showReviewModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      @click.self="showReviewModal = false"
    >
      <div class="bg-panel-dark border border-border-dark rounded-xl w-full max-w-md p-6 space-y-4">
        <h3 class="text-lg font-bold text-white">
          {{ selectedTask?.latest_review ? 'Update Review' : 'Add Review' }}
        </h3>
        <p class="text-sm text-slate-400">
          Task: {{ selectedTask?.title }}
        </p>
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Review / Feedback</label>
          <textarea
            v-model="reviewText"
            rows="4"
            placeholder="Enter your review or feedback..."
            class="w-full bg-slate-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-purple resize-none border border-slate-700"
          />
        </div>
        <div class="flex gap-3">
          <button
            class="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
            @click="showReviewModal = false"
          >
            Cancel
          </button>
          <button
            :disabled="isSubmitting || !reviewText.trim()"
            class="flex-1 bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-bold py-2.5 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
            @click="submitReview"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Review' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>