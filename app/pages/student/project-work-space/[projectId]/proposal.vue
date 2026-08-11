<script setup lang="ts">
import { useI18n } from '~/composables/useI18n.js'
import WorkspaceHeader from '~/components/layout/WorkspaceHeader.vue'
import KanbanBoard from '~/components/task/KanbanBoard.vue'
import TaskDetailModal from '~/components/task/TaskDetailModal.vue'
import CreateTaskModal from '~/components/task/CreateTaskModal.vue'
import { useProposalForm } from '~/composables/useProposal/useProposalForm.js'
import { useProposalWebSocket } from '~/composables/useProposal/useProposalWebSocket.js'
import { useTaskBoard } from '~/composables/useTask/useTaskBoard.js'
import { useTaskWebSocket } from '~/composables/useTask/useTaskWebSocket.js'
import type { UpdateTaskPayload, UpdateStatusPayload } from '~/composables/useTask/useTaskBoard'

const route = useRoute()
const router = useRouter()
const { t, toggleLocale, dir } = useI18n()

const projectId = computed((): number => {
  const id = route.params.id || route.params.projectId

  return id ? Number(id) : 0
})

const activeTab = ref<'kanban' | 'proposal'>('proposal')
const selectedTaskId = ref<number | null>(null)
const activeColumnForAdd = ref<string | null>(null)

const {
  form,
  project,
  proposal,
  mindMapProblemPreview,
  mindMapSolutionPreview,
  isSaving,
  projectTeamId,
  saveAsDraft,
  submitProposal,
} = useProposalForm(projectId)

const {
  isConnected: proposalWsConnected,
  isCollaborating,
  collaborators,
} = useProposalWebSocket(projectTeamId)

const {
  kanbanColumns,
  teamMembers,
  isTasksLoading,
  createTask,
  updateTask,
  updateTaskStatus,
  completeTask,
  deleteTask,
  uploadAttachment,
  deleteAttachment,
  addLink,
  deleteLink,
  findTaskInColumns,
  handleWebSocketEvent
} = useTaskBoard(projectTeamId)

const { isConnected: taskWsConnected, onEvent } = useTaskWebSocket(projectTeamId)

onEvent((event) => {
  handleWebSocketEvent(event)
})

const selectedTask = computed((): import('~/composables/useTask/useTaskBoard').Task | null => {
  if (!selectedTaskId.value) return null

  return findTaskInColumns(selectedTaskId.value) ?? null
})

const handleAddTask = (columnId: string): void => {
  activeColumnForAdd.value = columnId
}

const handleCreateTaskDetailed = (data: { title: string; description: string; priority: string; assigned_to: number | null; due_date: string | null }): void => {
  if (!activeColumnForAdd.value) return

  createTask({
    title: data.title,
    description: data.description,
    status: activeColumnForAdd.value,
    priority: data.priority,
    assigned_to: data.assigned_to,
    due_date: data.due_date,
  })

  activeColumnForAdd.value = null
}

const handleTaskClick = (taskId: number): void => {
  selectedTaskId.value = taskId
}

const handleTaskMove = (taskId: number, newStatus: string, _oldStatus: string): void => {
  if (newStatus === 'done') {
    selectedTaskId.value = taskId

    return
  }
  updateTaskStatus(taskId, newStatus)
}

const handleUpdateTask = (taskId: number, data: UpdateTaskPayload): void => {
  updateTask(taskId, data)
}

const handleDeleteTask = (taskId: number): void => {
  if (confirm(dir.value === 'rtl' ? 'هل أنت متأكد من حذف هذه المهمة؟' : 'Are you sure you want to delete this task?')) {
    deleteTask(taskId)
    selectedTaskId.value = null
  }
}

const handleCompleteTask = (taskId: number, data: UpdateStatusPayload): void => {
  completeTask(taskId, data)
  selectedTaskId.value = null
}

const goToSupervisorMatching = (): void => {
  const currentProposalId = proposal.value?.id
  if (!currentProposalId) {
    const appToast = useAppToast()
    appToast.error(dir.value === 'rtl' ? 'خطأ' : 'Error', dir.value === 'rtl' ? 'يرجى حفظ مقترحك أولاً' : 'Please save your proposal first')

    return
  }
  router.push(`/student/project-work-space/${projectId.value}/supervisors`)
}

const goToFinalSubmission = (): void => {
  router.push(`/student/project-work-space/${projectId.value}/final-submission`)
}
</script>

<template>
  <div class="min-h-screen text-slate-100 font-sans antialiased flex" :dir="dir">
    <main class="flex-1 flex flex-col min-h-screen">
      <WorkspaceHeader title="" :subtitle="project?.title || (dir === 'rtl' ? 'جاري التحميل...' : 'Loading...')">
        <div class="flex items-center gap-3" :class="dir === 'rtl' ? 'flex-row-reverse' : ''">
          <div v-if="isCollaborating" class="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1">
            <div class="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span class="text-xs text-blue-400 font-medium">{{ collaborators.length }} {{ t('editing') }}</span>
          </div>

          <div class="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
            <div class="h-1.5 w-1.5 rounded-full" :class="proposalWsConnected ? 'bg-emerald-400' : 'bg-red-400'" />
            <span class="text-xs font-medium" :class="proposalWsConnected ? 'text-emerald-400' : 'text-red-400'">
              {{ proposalWsConnected ? t('live') : t('offline') }}
            </span>
          </div>

          <div v-if="activeTab === 'kanban'" class="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1">
            <div class="h-1.5 w-1.5 rounded-full" :class="taskWsConnected ? 'bg-purple-400' : 'bg-red-400'" />
            <span class="text-xs font-medium" :class="taskWsConnected ? 'text-purple-400' : 'text-red-400'">
              {{ t('tasksLive') }} {{ taskWsConnected ? t('live') : t('offline') }}
            </span>
          </div>

          <button
            class="text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-border-dark hover:border-slate-600"
            :class="{ 'bg-slate-800 text-white': activeTab === 'kanban' }"
            @click="activeTab = 'kanban'"
          >
            {{ t('kanban') }}
          </button>
          <button
            class="text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-border-dark hover:border-slate-600"
            :class="{ 'bg-slate-800 text-white': activeTab === 'proposal' }"
            @click="activeTab = 'proposal'"
          >
            {{ t('editor') }}
          </button>

          <button class="text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-border-dark hover:border-slate-600 flex items-center gap-1" @click="goToSupervisorMatching">
            <UIcon name="i-heroicons-share" class="h-3.5 w-3.5" />
            {{ t('share') }}
          </button>

          <button class="text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-border-dark hover:border-slate-600 flex items-center gap-1" @click="goToFinalSubmission">
            {{ t('finalSubmission') }}
          </button>

          <button 
            class="text-xs font-bold text-brand-purple hover:text-brand-purple-hover transition-colors px-3 py-1.5 rounded-lg border border-brand-purple/30 hover:border-brand-purple/60 bg-brand-purple/5"
            @click="toggleLocale"
          >
            {{ t('switchLang') }}
          </button>

          <button class="flex items-center gap-1.5 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors" :disabled="isSaving" @click="saveAsDraft">
            <UIcon v-if="isSaving" name="i-heroicons-arrow-path" class="h-3.5 w-3.5 animate-spin" />
            <UIcon v-else name="i-heroicons-check" class="h-3.5 w-3.5" />
            {{ isSaving ? t('saving') : t('save') }}
          </button>

        </div>
      </WorkspaceHeader>

      <ProposalEditor
        v-if="activeTab === 'proposal'"
        ref="proposalEditorRef"
        v-model:form="form"
        v-model:mind-map-problem-preview="mindMapProblemPreview"
        v-model:mind-map-solution-preview="mindMapSolutionPreview"
        :project="project"
        :is-saving="isSaving"
        @submit="submitProposal"
        @save-draft="saveAsDraft"
      />

      <KanbanBoard
        v-else
        :columns="kanbanColumns"
        :is-loading="isTasksLoading"
        @add-task="handleAddTask"
        @task-click="handleTaskClick"
        @task-move="handleTaskMove"
      />
    </main>

    <CreateTaskModal
      :is-open="!!activeColumnForAdd"
      :column-id="activeColumnForAdd ?? ''"
      :column-title="kanbanColumns.find(c => c.id === activeColumnForAdd)?.title ?? ''"
      :members="teamMembers?.members"
      @close="activeColumnForAdd = null"
      @create="handleCreateTaskDetailed"
    />

    <TaskDetailModal
      :is-open="!!selectedTaskId"
      :task="selectedTask"
      :members="teamMembers"
      @close="selectedTaskId = null"
      @update="handleUpdateTask"
      @delete="handleDeleteTask"
      @status-change="updateTaskStatus"
      @complete="handleCompleteTask"
      @upload-attachment="uploadAttachment"
      @delete-attachment="deleteAttachment"
      @add-link="addLink"
      @delete-link="deleteLink"
    />
  </div>
</template>