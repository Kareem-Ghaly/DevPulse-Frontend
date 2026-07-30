export const SKILL_COLORS: Record<string, string> = {
  laravel: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'vue.js': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  vue: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  nuxt: 'bg-green-500/10 text-green-400 border-green-500/20',
  mysql: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'machine learning': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  tailwind: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  typescript: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  python: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  tensorflow: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  d3: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  elasticsearch: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  'ar.js': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
}

export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  published: { label: 'Published', color: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-400' },
  forming: { label: 'Forming', color: 'text-amber-400', bg: 'bg-amber-500/10', dot: 'bg-amber-400' },
  team_completed: { label: 'Team Ready', color: 'text-blue-400', bg: 'bg-blue-500/10', dot: 'bg-blue-400' },
  draft: { label: 'Draft', color: 'text-slate-400', bg: 'bg-slate-500/10', dot: 'bg-slate-400' },
  archived: { label: 'Archived', color: 'text-rose-400', bg: 'bg-rose-500/10', dot: 'bg-rose-400' },
}

export const MEMBER_ROLE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  leader: { label: 'Leader', color: 'text-purple-400', bg: 'bg-purple-500/10', icon: 'i-heroicons-star' },
  member: { label: 'Member', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: 'i-heroicons-user' },
}

export const KANBAN_COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: 'bg-slate-500' },
  { id: 'todo', title: 'To Do', color: 'bg-amber-500' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-blue-500' },
  { id: 'done', title: 'Done', color: 'bg-emerald-500' },
] as const