<script setup lang="ts">

interface Props {
  isOpen: boolean
  columnId: string
  columnTitle: string
  members: TeamMember[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  create: [data: { title: string; description: string; priority: string; assigned_to: number | null; due_date: string | null }]
}>()

const form = reactive({
  title: '',
  description: '',
  priority: 'medium' as 'low' | 'medium' | 'high',
  assigned_to: null as number | null,
  due_date: null as string | null,
})

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'bg-blue-500' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-500' },
  { value: 'high', label: 'High', color: 'bg-rose-500' },
] as const

const handleSubmit = () => {
  if (!form.title.trim()) return
  
  emit('create', {
    title: form.title.trim(),
    description: form.description.trim() || '',
    priority: form.priority,
    assigned_to: form.assigned_to,
    due_date: form.due_date || null,
  })
  
  form.title = ''
  form.description = ''
  form.priority = 'medium'
  form.assigned_to = null
  form.due_date = null
}

watch(() => props.isOpen, (open) => {
  if (!open) {
    form.title = ''
    form.description = ''
    form.priority = 'medium'
    form.assigned_to = null
    form.due_date = null
  }
})
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
          class="relative bg-panel-dark rounded-xl border border-border-dark max-w-lg w-full mx-4 shadow-2xl"
          @click.stop
        >
          <div class="p-6 border-b border-border-dark flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-white">Create Task</h3>
              <p class="text-xs text-slate-500 mt-1">in {{ columnTitle }}</p>
            </div>
            <button class="text-slate-500 hover:text-white transition-colors" @click="$emit('close')">
              <UIcon name="i-heroicons-x-mark" class="h-5 w-5" />
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <label class="text-xs text-slate-500 font-medium mb-1.5 block">Title *</label>
              <input
                v-model="form.title"
                type="text"
                placeholder="Enter task title..."
                class="w-full bg-slate-800/80 border border-border-dark rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all"
                @keydown.enter="handleSubmit"
              />
            </div>

            <div>
              <label class="text-xs text-slate-500 font-medium mb-1.5 block">Description</label>
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Enter task description..."
                class="w-full bg-slate-800/80 border border-border-dark rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all resize-none"
              />
            </div>

            <div>
              <label class="text-xs text-slate-500 font-medium mb-1.5 block">Priority</label>
              <div class="flex gap-2">
                <button
                  v-for="opt in priorityOptions"
                  :key="opt.value"
                  class="flex-1 py-2.5 rounded-lg border text-xs font-medium transition-all"
                  :class="form.priority === opt.value 
                    ? 'border-brand-purple text-brand-purple bg-brand-purple/10 shadow-sm shadow-brand-purple/10' 
                    : 'border-border-dark text-slate-500 hover:border-slate-600 hover:text-slate-300'"
                  @click="form.priority = opt.value"
                >
                  <span class="h-2 w-2 rounded-full inline-block mr-1.5" :class="opt.color" />
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <div>
              <label class="text-xs text-slate-500 font-medium mb-1.5 block">Assigned To</label>
              <select
                v-model="form.assigned_to"
                class="w-full bg-slate-800/80 border border-border-dark rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all"
              >
                <option :value="null">Unassigned</option>
                <option v-for="member in members" :key="member.id" :value="member.id">
                  {{ member.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="text-xs text-slate-500 font-medium mb-1.5 block">Due Date</label>
              <input
                v-model="form.due_date"
                type="date"
                class="w-full bg-slate-800/80 border border-border-dark rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all"
              />
            </div>
          </div>

          <div class="p-6 border-t border-border-dark flex items-center gap-3">
            <button
              class="flex-1 bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-purple/20"
              :disabled="!form.title.trim()"
              @click="handleSubmit"
            >
              Create Task
            </button>
            <button
              class="px-4 py-2.5 text-sm text-slate-400 hover:text-white border border-border-dark hover:border-slate-600 rounded-lg transition-all"
              @click="$emit('close')"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>