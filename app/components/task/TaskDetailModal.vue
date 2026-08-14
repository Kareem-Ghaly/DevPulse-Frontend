<script setup lang="ts">
import type { Task, TeamMember, UpdateTaskPayload, UpdateStatusPayload } from '~/composables/useTask/useTaskBoard'

interface Props {
  task: Task | null
  members: TeamMember[]
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  update: [taskId: number, data: UpdateTaskPayload]
  delete: [taskId: number]
  statusChange: [taskId: number, status: string]
  complete: [taskId: number, data: UpdateStatusPayload]
  uploadAttachment: [taskId: number, files: File[]]
  deleteAttachment: [attachmentId: number]
  addLink: [taskId: number, url: string, title?: string]
  deleteLink: [linkId: number]
}>()

const activeTab = ref<'details' | 'attachments' | 'links' | 'supervisor'>('details')
const isEditing = ref(false)

interface EditForm {
  title: string
  description: string
  priority: string
  assigned_to: number | null
  due_date: string | null
}

const editForm = reactive<EditForm>({
  title: '',
  description: '',
  priority: 'medium',
  assigned_to: null,
  due_date: null,
})

interface CompletionForm {
  notes: string
  linkUrl: string
  files: File[]
}

const completionForm = reactive<CompletionForm>({
  notes: '',
  linkUrl: '',
  files: [],
})

const fileInput = ref<HTMLInputElement | null>(null)

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      editForm.title = newTask.title || ''
      editForm.description = newTask.description || ''
      editForm.priority = newTask.priority || 'medium'
      editForm.assigned_to = newTask.assigned_to ?? null
      editForm.due_date = newTask.due_date ? newTask.due_date.split('T')[0] : null
      isEditing.value = false
      completionForm.notes = ''
      completionForm.linkUrl = ''
      completionForm.files = []
    }
  },
  { immediate: true }
)

const handleSave = (): void => {
  if (!props.task) return

  const payload: UpdateTaskPayload = {
    title: editForm.title,
    description: editForm.description,
    priority: editForm.priority,
    assigned_to: editForm.assigned_to,
    due_date: editForm.due_date ?? undefined,
  }

  emit('update', props.task.id, payload)
  isEditing.value = false
}

const handleStatusChange = (newStatus: string): void => {
  if (!props.task) return

  if (newStatus === 'done' && props.task.status !== 'done') {
    return
  }

  emit('statusChange', props.task.id, newStatus)
}

const handleComplete = (): void => {
  if (!props.task) return

  const payload: UpdateStatusPayload = {
    status: 'done',
    notes: completionForm.notes || undefined,
    link_url: completionForm.linkUrl || undefined,
    files: completionForm.files.length > 0 ? completionForm.files : undefined,
  }

  emit('complete', props.task.id, payload)
}

const handleFileChange = (e: Event): void => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    completionForm.files = Array.from(target.files)
  }
}

const handleAttachmentUpload = (e: Event): void => {
  const target = e.target as HTMLInputElement
  if (target.files && props.task) {
    emit('uploadAttachment', props.task.id, Array.from(target.files))
    target.value = ''
  }
}

const handleAddLink = (e: MouseEvent): void => {
  const button = e.target as HTMLElement
  const input = button.previousElementSibling as HTMLInputElement
  if (input && input.value && props.task) {
    emit('addLink', props.task.id, input.value)
    input.value = ''
  }
}

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'text-blue-400' },
  { value: 'medium', label: 'Medium', color: 'text-amber-400' },
  { value: 'high', label: 'High', color: 'text-rose-400' },
] as const

const statusOptions = [
  { value: 'backlog', label: 'Backlog', icon: 'i-heroicons-circle' },
  { value: 'todo', label: 'To Do', icon: 'i-heroicons-check-circle' },
  { value: 'in_progress', label: 'In Progress', icon: 'i-heroicons-arrow-path' },
  { value: 'done', label: 'Done', icon: 'i-heroicons-check-badge' },
] as const
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center"
        @click.self="$emit('close')"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <div
          v-if="task"
          class="relative bg-panel-dark rounded-xl border border-border-dark max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl"
          @click.stop
        >
          <div class="p-6 border-b border-border-dark">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div v-if="!isEditing" class="flex items-center gap-2">
                  <h2 class="text-lg font-bold text-white break-all line-clamp-1">{{ task.title }}</h2>
                  <button
                    class="text-slate-500 hover:text-white transition-colors"
                    @click="isEditing = true"
                  >
                    <UIcon name="i-heroicons-pencil-square" class="h-4 w-4" />
                  </button>
                </div>
                <input
                  v-else
                  v-model="editForm.title"
                  class="w-full bg-slate-800 border border-border-dark rounded-lg px-3 py-2 text-white text-lg font-bold focus:outline-none focus:border-brand-purple"
                />
              </div>
              <button class="text-slate-500 hover:text-white" @click="$emit('close')">
                <UIcon name="i-heroicons-x-mark" class="h-5 w-5" />
              </button>
            </div>

            <div class="mt-3 flex items-center gap-2">
              <span
                class="px-2.5 py-1 rounded-full text-sm font-medium capitalize"
                :class="{
                  'bg-slate-500/20 text-slate-400': task.status === 'backlog',
                  'bg-blue-500/20 text-blue-400': task.status === 'todo',
                  'bg-amber-500/20 text-amber-400': task.status === 'in_progress',
                  'bg-emerald-500/20 text-emerald-400': task.status === 'done',
                }"
              >
                {{ task.status.replace('_', ' ') }}
              </span>
              <span v-if="task.completed_by_user" class="text-sm text-slate-500">
                Completed by {{ task.completed_by_user.name }}
              </span>
            </div>
          </div>

          <div class="flex border-b border-border-dark">
            <button
              v-for="tab in ['details', 'attachments', 'links', 'supervisor'] as const"
              :key="tab"
              class="px-4 py-3 text-sm font-medium capitalize transition-colors"
              :class="activeTab === tab ? 'text-brand-purple border-b-2 border-brand-purple' : 'text-slate-500 hover:text-slate-300'"
              @click="activeTab = tab"
            >
              {{ tab === 'supervisor' ? 'Supervisor Review' : tab }}
            </button>
          </div>

          <div class="p-6">
            <div v-if="activeTab === 'details'">
              <div class="mb-4">
                <label class="text-sm text-slate-500 font-medium mb-1 block">Description</label>
                <p v-if="!isEditing" class="text-sm text-slate-300 break-all line-clamp-1 whitespace-pre-wrap">
                  {{ task.description || 'No description' }}
                </p>
                <textarea
                  v-else
                  v-model="editForm.description"
                  rows="4"
                  class="w-full bg-slate-800 border border-border-dark rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div class="mb-4">
                <label class="text-sm text-slate-500 font-medium mb-1 block">Priority</label>
                <div v-if="!isEditing" class="flex items-center gap-2">
                  <span
                    class="h-2 w-2 rounded-full"
                    :class="{
                      'bg-rose-500': task.priority === 'high',
                      'bg-amber-500': task.priority === 'medium',
                      'bg-blue-500': task.priority === 'low',
                    }"
                  />
                  <span class="text-sm text-slate-300 capitalize">{{ task.priority }}</span>
                </div>
                <select
                  v-else
                  v-model="editForm.priority"
                  class="w-full bg-slate-800 border border-border-dark rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-purple"
                >
                  <option v-for="opt in priorityOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <div class="mb-4">
                <label class="text-sm text-slate-500 font-medium mb-1 block">Assigned To</label>
                <div v-if="!isEditing" class="text-sm text-slate-300">
                  {{ task.assigned_user?.name || 'Unassigned' }}
                </div>
                <select
                  v-else
                  v-model="editForm.assigned_to"
                  class="w-full bg-slate-800 border border-border-dark rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-purple"
                >
                  <option :value="null">Unassigned</option>
                  <option v-for="member in members" :key="member.id" :value="member.id">
                    {{ member.name }}
                  </option>
                </select>
              </div>

              <div class="mb-4">
                <label class="text-sm text-slate-500 font-medium mb-1 block">Due Date</label>
                <div v-if="!isEditing" class="text-sm text-slate-300">
                  {{ task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date' }}
                </div>
                <input
                  v-else
                  :value="editForm.due_date || ''"
                  type="date"
                  class="w-full bg-slate-800 border border-border-dark rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-purple"
                  @input="(e) => { editForm.due_date = (e.target as HTMLInputElement).value || null }"
                />
              </div>

              <div v-if="task.completion_notes" class="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <label class="text-sm text-emerald-400 font-medium mb-1 block">Completion Notes</label>
                <p class="text-sm text-slate-300">{{ task.completion_notes }}</p>
              </div>

              <div v-if="task.status !== 'done'" class="mt-6 p-4 bg-slate-800/50 rounded-lg border border-border-dark">
                <h4 class="text-sm font-bold text-white mb-3">Complete Task</h4>
                <textarea
                  v-model="completionForm.notes"
                  placeholder="Add completion notes..."
                  rows="2"
                  class="w-full bg-slate-800 border border-border-dark rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple mb-3"
                />
                <input
                  v-model="completionForm.linkUrl"
                  type="url"
                  placeholder="Add link URL (optional)..."
                  class="w-full bg-slate-800 border border-border-dark rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple mb-3"
                />
                <div class="flex items-center gap-3">
                  <input
                    ref="fileInput"
                    type="file"
                    multiple
                    class="hidden"
                    @change="handleFileChange"
                  />
                  <button
                    class="text-sm text-slate-400 hover:text-white flex items-center gap-1 px-3 py-2 rounded-lg border border-border-dark hover:border-slate-600 transition-colors"
                    @click="fileInput?.click()"
                  >
                    <UIcon name="i-heroicons-paper-clip" class="h-4 w-4" />
                    {{ completionForm.files.length > 0 ? `${completionForm.files.length} files selected` : 'Attach Files' }}
                  </button>
                  <button
                    class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    @click="handleComplete"
                  >
                    Mark as Done
                  </button>
                </div>
              </div>

              <div class="mt-6 flex items-center gap-3">
                <template v-if="isEditing">
                  <button
                    class="flex-1 bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    @click="handleSave"
                  >
                    Save Changes
                  </button>
                  <button
                    class="px-4 py-2 text-sm text-slate-400 hover:text-white border border-border-dark rounded-lg"
                    @click="isEditing = false"
                  >
                    Cancel
                  </button>
                </template>
                <button
                  v-else
                  class="text-sm text-rose-400 hover:text-rose-300 flex items-center gap-1 px-3 py-2 rounded-lg border border-rose-500/20 hover:border-rose-500/40 transition-colors"
                  @click="$emit('delete', task.id)"
                >
                  <UIcon name="i-heroicons-trash" class="h-4 w-4" />
                  Delete Task
                </button>
              </div>
            </div>

            <div v-else-if="activeTab === 'attachments'">
              <div class="mb-4">
                <input
                  type="file"
                  multiple
                  class="hidden"
                  @change="handleAttachmentUpload"
                />
                <button
                  class="w-full py-3 border-2 border-dashed border-border-dark rounded-lg text-slate-500 hover:text-white hover:border-slate-600 transition-colors flex items-center justify-center gap-2"
                  @click="($event.target as HTMLElement).previousElementSibling?.click()"
                >
                  <UIcon name="i-heroicons-cloud-arrow-up" class="h-5 w-5" />
                  <span class="text-sm">Upload Files</span>
                </button>
              </div>

              <div v-if="task.attachments?.length" class="space-y-2">
                <div
                  v-for="attachment in task.attachments"
                  :key="attachment.id"
                  class="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                >
                  <div class="flex items-center gap-3">
                    <UIcon name="i-heroicons-document" class="h-5 w-5 text-slate-400" />
                    <div>
                      <p class="text-sm text-slate-200">{{ attachment.file_name }}</p>
                      <p class="text-[10px] text-slate-500">{{ (attachment.file_size / 1024).toFixed(1) }} KB</p>
                    </div>
                  </div>
                  <button
                    class="text-slate-500 hover:text-rose-400 transition-colors"
                    @click="$emit('deleteAttachment', attachment.id)"
                  >
                    <UIcon name="i-heroicons-trash" class="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div v-else class="text-center py-8 text-slate-600">
                <p class="text-sm">No attachments yet</p>
              </div>
            </div>

            <div v-else-if="activeTab === 'links'">
              <div class="mb-4">
                <div class="flex gap-2">
                  <input
                    type="url"
                    placeholder="Enter URL..."
                    class="flex-1 bg-slate-800 border border-border-dark rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
                  />
                  <button
                    class="bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    @click="handleAddLink"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div v-if="task.links?.length" class="space-y-2">
                <a
                  v-for="link in task.links"
                  :key="link.id"
                  :href="link.url"
                  target="_blank"
                  class="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors group"
                >
                  <div class="flex items-center gap-3">
                    <UIcon name="i-heroicons-link" class="h-5 w-5 text-slate-400" />
                    <div>
                      <p class="text-sm text-slate-200 group-hover:text-brand-purple transition-colors">{{ link.title || link.url }}</p>
                      <p class="text-[10px] text-slate-500 truncate max-w-[300px]">{{ link.url }}</p>
                    </div>
                  </div>
                  <button
                    class="text-slate-500 hover:text-rose-400 transition-colors"
                    @click.prevent="$emit('deleteLink', link.id)"
                  >
                    <UIcon name="i-heroicons-trash" class="h-4 w-4" />
                  </button>
                </a>
              </div>
              <div v-else class="text-center py-8 text-slate-600">
                <p class="text-sm">No links yet</p>
              </div>
            </div>

            <div v-else-if="activeTab === 'supervisor'">
              <div v-if="task.latest_review" class="space-y-4">
                <div class="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div class="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <UIcon name="i-heroicons-user-circle" class="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-white">{{ task.latest_review.supervisor.name }}</p>
                    <p class="text-xs text-slate-400">{{ task.latest_review.supervisor.email }}</p>
                  </div>
                  <div class="ml-auto text-right">
                    <p class="text-[10px] text-slate-500 uppercase tracking-wider">Reviewed at</p>
                    <p class="text-xs text-slate-300">
                      {{ new Date(task.latest_review.reviewed_at).toLocaleDateString() }}
                    </p>
                  </div>
                </div>

                <div class="p-4 bg-slate-800/50 rounded-lg border border-border-dark">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                    Review Notes
                  </label>
                  <p class="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {{ task.latest_review.review }}
                  </p>
                </div>
              </div>

              <div v-else class="text-center py-12">
                <div class="mb-3 flex justify-center">
                  <div class="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center">
                    <UIcon name="i-heroicons-clipboard-document-list" class="h-8 w-8 text-slate-600" />
                  </div>
                </div>
                <p class="text-sm text-slate-500 font-medium">No supervisor review yet</p>
                <p class="text-xs text-slate-600 mt-1">The supervisor hasn't reviewed this task.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>