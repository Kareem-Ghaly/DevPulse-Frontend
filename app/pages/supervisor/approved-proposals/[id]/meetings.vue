<script setup lang="ts">
import SupervisorNavbar from '~/components/task/SupervisorNavbar.vue'
import type { Meeting, SingleResponse, PaginatedResponse } from '~/types/supervisor.types'

const route = useRoute()
const proposalId = computed(() => Number(route.params.id) || 0)
const projectTeamId = ref<number | null>(null)

const api = useApiClient()
const appToast = useAppToast()

const meetings = ref<Meeting[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const showScheduleModal = ref(false)

const scheduleForm = reactive({
  title: '',
  description: '',
  scheduled_at: '',
  duration_minutes: 60,
})

const fetchProposalDetails = async () => {
  if (!proposalId.value) return

  try {
    const res = await api.request<SingleResponse<{ project_team_id: number }>>(`/project-proposals/${proposalId.value}`)
    projectTeamId.value = res.data?.proposal?.team?.id || null
    if (projectTeamId.value) {
      await fetchMeetings()
    }
  }
  catch (error: unknown) {
    const err = error as { message?: string }
    appToast.error('Error', err.message || 'Failed to load project details')
  }
}

const fetchMeetings = async () => {
  if (!projectTeamId.value) return

  isLoading.value = true
  try {
    const res = await api.request<PaginatedResponse<Meeting>>(`/project-teams/${projectTeamId.value}/meetings`)
    meetings.value = res.data || []
  }
  catch (error: unknown) {
    const err = error as { message?: string }
    appToast.error('Error', err.message || 'Failed to load meetings')
  }
  finally {
    isLoading.value = false
  }
}

const scheduleMeeting = async () => {
  if (!projectTeamId.value) {
    appToast.error('Error', 'No project team selected.')
    
    return
  }

  isSubmitting.value = true

  try {
    await api.request<SingleResponse<Meeting>>('/meetings', {
      method: 'POST',
      body: {
        project_team_id: projectTeamId.value,
        title: scheduleForm.title,
        description: scheduleForm.description,
        scheduled_at: new Date(scheduleForm.scheduled_at).toISOString(),
        duration_minutes: scheduleForm.duration_minutes,
      },
    })

    appToast.success('Success', 'Meeting scheduled successfully!')
    showScheduleModal.value = false
    scheduleForm.title = ''
    scheduleForm.description = ''
    scheduleForm.scheduled_at = ''
    scheduleForm.duration_minutes = 60
    await fetchMeetings()
  }
  catch (error: unknown) {
    const err = error as { message?: string }
    appToast.error('Error', err.message || 'Failed to schedule meeting')
  }
  finally {
    isSubmitting.value = false
  }
}

const viewMeeting = (meetingId: number) => {
  navigateTo(`/meetings/${meetingId}`)
}

const goBack = () => {
  navigateTo('/supervisor/approved-proposals')
}

const formatDate = (date: string | null) => {
  if (!date) return '-'

  return new Date(date).toLocaleString()
}

const canJoinMeeting = (meeting: Meeting): boolean => {
  if (!meeting?.scheduled_at) {
    return false
  }

  const now = new Date()
  const meetingTime = new Date(meeting.scheduled_at)

  const isToday = now.toDateString() === meetingTime.toDateString()
  if (!isToday) {
    return false
  }

  const fiveMinutesBefore = meetingTime.getTime() - 5 * 60 * 1000
  const nowTime = now.getTime()

  return nowTime >= fiveMinutesBefore
}

const getJoinButtonText = (meeting: Meeting): string => {
  if (!meeting?.scheduled_at) {
    return 'Join Meeting'
  }

  const now = new Date()
  const meetingTime = new Date(meeting.scheduled_at)

  const isToday = now.toDateString() === meetingTime.toDateString()
  if (!isToday) {
    const dateStr = meetingTime.toLocaleDateString()

    return `Available on ${dateStr}`
  }

  const fiveMinutesBefore = meetingTime.getTime() - 5 * 60 * 1000
  const nowTime = now.getTime()

  if (nowTime < fiveMinutesBefore) {
    const timeStr = meetingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    return `Starts at ${timeStr}`
  }

  return 'Join Meeting'
}

onMounted(() => {
  fetchProposalDetails()
})
</script>

<template>
  <div class="min-h-screen bg-brand-deep text-slate-100">
    <SupervisorNavbar />
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <button
            class="text-slate-400 hover:text-white transition-colors cursor-pointer"
            @click="goBack"
          >
            <UIcon name="i-heroicons-arrow-left" class="h-5 w-5" />
          </button>
          <div>
            <h1 class="text-2xl font-black text-white tracking-tight">
              Project Meetings
            </h1>
            <p class="text-slate-400 text-sm mt-1">
              Schedule and manage meetings with your team
            </p>
          </div>
        </div>
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-purple hover:bg-brand-purple-hover text-sm font-bold text-white transition-colors cursor-pointer"
          @click="showScheduleModal = true"
        >
          <UIcon name="i-heroicons-plus" class="h-4 w-4" />
          Schedule Meeting
        </button>
      </div>

      <div v-if="isLoading" class="text-center py-12 text-slate-400">
        <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin mx-auto mb-3" />
        <p>Loading meetings...</p>
      </div>

      <div v-else-if="meetings.length === 0" class="text-center py-12">
        <UIcon name="i-heroicons-video-camera" class="h-12 w-12 mx-auto mb-3 text-slate-600" />
        <h3 class="text-lg font-bold text-white mb-1">
          No meetings scheduled
        </h3>
        <p class="text-slate-400 text-sm mb-4">
          Schedule your first meeting with the team.
        </p>
        <button
          class="px-4 py-2 rounded-lg bg-brand-purple hover:bg-brand-purple-hover text-sm font-bold text-white transition-colors cursor-pointer"
          @click="showScheduleModal = true"
        >
          Schedule Meeting
        </button>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="meeting in meetings"
          :key="meeting.id"
          class="bg-panel-dark border border-border-dark rounded-xl p-5 hover:border-brand-purple/30 transition-colors"
        >
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-base font-bold text-white">
              {{ meeting.title }}
            </h3>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
              :class="meeting.status ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-500/10 text-slate-400'"
            >
              {{ meeting.status || 'Scheduled' }}
            </span>
          </div>

          <p v-if="meeting.description" class="text-xs text-slate-400 mb-3">
            {{ meeting.description }}
          </p>

          <div class="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-4">
            <div class="flex items-center gap-1.5">
              <UIcon name="i-heroicons-calendar" class="h-3.5 w-3.5" />
              <span>{{ formatDate(meeting.scheduled_at) }}</span>
            </div>
            <div v-if="meeting.duration_minutes" class="flex items-center gap-1.5">
              <UIcon name="i-heroicons-clock" class="h-3.5 w-3.5" />
              <span>{{ meeting.duration_minutes }} min</span>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-3 border-t border-border-dark">
            <!-- ✅ زر الانضمام مع التحقق من الوقت -->
            <button
              v-if="meeting.meeting_link"
              :disabled="!canJoinMeeting(meeting)"
              class="flex-1 text-xs font-bold py-2 rounded-lg transition-colors text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              :class="canJoinMeeting(meeting) 
                ? 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-400' 
                : 'bg-slate-800 text-slate-500'"
              @click="canJoinMeeting(meeting) ? navigateTo(meeting.meeting_link, { external: true }) : null"
            >
              {{ getJoinButtonText(meeting) }}
            </button>
            <button
              class="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer"
              @click="viewMeeting(meeting.id)"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showScheduleModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      @click.self="showScheduleModal = false"
    >
      <div class="bg-panel-dark border border-border-dark rounded-xl w-full max-w-md p-6 space-y-4">
        <h3 class="text-lg font-bold text-white">
          Schedule New Meeting
        </h3>

        <div class="space-y-3">
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Title</label>
            <input
              v-model="scheduleForm.title"
              type="text"
              placeholder="Meeting title..."
              class="w-full bg-slate-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-purple border border-slate-700"
            >
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Description</label>
            <textarea
              v-model="scheduleForm.description"
              rows="2"
              placeholder="Meeting description..."
              class="w-full bg-slate-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-purple resize-none border border-slate-700"
            />
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Scheduled At</label>
            <input
              v-model="scheduleForm.scheduled_at"
              type="datetime-local"
              class="w-full bg-slate-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-purple border border-slate-700"
            >
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Duration (minutes)</label>
            <input
              v-model.number="scheduleForm.duration_minutes"
              type="number"
              min="15"
              max="300"
              class="w-full bg-slate-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-purple border border-slate-700"
            >
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            class="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
            @click="showScheduleModal = false"
          >
            Cancel
          </button>
          <button
            :disabled="isSubmitting || !scheduleForm.title || !scheduleForm.scheduled_at"
            class="flex-1 bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-bold py-2.5 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
            @click="scheduleMeeting"
          >
            {{ isSubmitting ? 'Scheduling...' : 'Schedule' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>