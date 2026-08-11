<script setup lang="ts">
import AppTopNav from '~/components/layout/AppTopNav.vue'

const route = useRoute()
const projectTeamId = computed(() => {
  return Number(route.params.projectId) || 0
})

const { meetings, isLoading, isSubmitting, fetchMeetings, scheduleMeeting } = useMeetings(projectTeamId)

const activeMeeting = ref<any>(null)
const showScheduleForm = ref(false)

const form = reactive({
  title: '',
  description: '',
  scheduled_at: '',
  duration_minutes: 60,
})

onMounted(fetchMeetings)

const handleSchedule = async () => {
  const payload = {
    ...form,
    scheduled_at: new Date(form.scheduled_at).toISOString()
  }

  await scheduleMeeting(payload)
  showScheduleForm.value = false
  
  form.title = ''
  form.description = ''
  form.scheduled_at = ''
  form.duration_minutes = 60
}

const joinMeeting = (meeting: any) => {
  activeMeeting.value = meeting
}

const closeMeeting = () => {
  activeMeeting.value = null
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

const canJoinMeeting = (meeting: any): boolean => {
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

const getJoinButtonText = (meeting: any): string => {
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

</script>

<template>
  <div>
    <AppTopNav />
    <div class="flex-1 p-4 md:p-8 overflow-y-auto">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-white">
            Meetings
          </h2>
          <button
            class="bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
            @click="showScheduleForm = !showScheduleForm"
          >
            {{ showScheduleForm ? 'Cancel' : 'Schedule Meeting' }}
          </button>
        </div>

        <div v-if="showScheduleForm" class="bg-panel-dark border border-border-dark rounded-xl p-4 md:p-6 space-y-4 mb-6">
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Title</label>
            <input
              v-model="form.title"
              type="text"
              placeholder="Meeting title..."
              class="w-full bg-transparent text-sm text-white placeholder-slate-600 border-b border-slate-700 focus:border-brand-purple outline-none pb-2 transition-colors"
            >
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
            <textarea
              v-model="form.description"
              rows="2"
              placeholder="Optional description..."
              class="w-full bg-transparent text-sm text-white placeholder-slate-600 border-b border-slate-700 focus:border-brand-purple outline-none pb-2 resize-none transition-colors"
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Date & Time</label>
              <input
                v-model="form.scheduled_at"
                type="datetime-local"
                class="w-full bg-transparent text-sm text-white placeholder-slate-600 border-b border-slate-700 focus:border-brand-purple outline-none pb-2 transition-colors"
              >
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Duration (min)</label>
              <input
                v-model.number="form.duration_minutes"
                type="number"
                min="15"
                class="w-full bg-transparent text-sm text-white placeholder-slate-600 border-b border-slate-700 focus:border-brand-purple outline-none pb-2 transition-colors"
              >
            </div>
          </div>
          <button
            :disabled="isSubmitting || !form.title || !form.scheduled_at"
            class="w-full bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-bold py-3 rounded-lg transition-all disabled:opacity-50"
            @click="handleSchedule"
          >
            {{ isSubmitting ? 'Scheduling...' : 'Schedule Meeting' }}
          </button>
        </div>

        <div v-if="isLoading" class="text-center py-12">
          <div class="inline-block w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
        </div>

        <div v-else-if="!meetings.length" class="text-center py-12 text-slate-500">
          No meetings scheduled yet.
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="meeting in meetings"
            :key="meeting.id"
            class="bg-panel-dark border border-border-dark rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-base font-bold text-white">
                  {{ meeting.title }}
                </h3>
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                  :class="meeting.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-500/10 text-slate-400'"
                >
                  {{ meeting.status }}
                </span>
              </div>
              <p v-if="meeting.description" class="text-xs text-slate-500 mb-2">
                {{ meeting.description }}
              </p>
              <div class="flex items-center gap-4 text-xs text-slate-400">
                <span>{{ formatDate(meeting.scheduled_at) }}</span>
                <span>{{ meeting.duration_minutes }} min</span>
                <span class="text-slate-600">by {{ meeting.scheduler?.name }}</span>
              </div>
            </div>
            <button
              :disabled="!canJoinMeeting(meeting)"
              class="shrink-0 hover:cursor-pointer text-xs font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :class="canJoinMeeting(meeting) ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'"
              @click="joinMeeting(meeting)"
            >
              {{ getJoinButtonText(meeting) }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="activeMeeting" class="fixed inset-0 z-50 flex flex-col bg-black">
        <div class="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <div>
            <h3 class="text-sm font-bold text-white">
              {{ activeMeeting.title }}
            </h3>
            <p class="text-xs text-slate-500">
              Jitsi Meet
            </p>
          </div>
          <button
            class="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors"
            @click="closeMeeting"
          >
            Leave Meeting
          </button>
        </div>
        <div class="flex-1">
          <iframe
            :src="activeMeeting.meeting_link"
            class="w-full h-full border-0"
            allow="camera; microphone; fullscreen; display-capture; screen-wake-lock; autoplay"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </div>
    </div>
  </div>
</template>