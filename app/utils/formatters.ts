export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)

  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

export function getSkillClasses(skill: string): string {
  const key = skill.toLowerCase()
  const colors: Record<string, string> = {
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

  return colors[key] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'
}

export function normalizeSkill(skill: string): string {
  return skill.trim().replace(/\s+/g, ' ').toUpperCase()
}

export function normalizeSkills(skills: string[] = []): string[] {
  return [...new Set(skills.map(normalizeSkill).filter(Boolean))]
}

export function getMatchColor(percentage: number): string {
  if (percentage >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  if (percentage >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
  
return 'text-slate-400 bg-slate-500/10 border-slate-500/20'
}

export function getMatchBarColor(percentage: number): string {
  if (percentage >= 80) return 'bg-emerald-500'
  if (percentage >= 50) return 'bg-amber-500'
  
return 'bg-slate-500'
}

export function getMatchTextColor(pct: number): string {
  if (pct >= 70) return 'text-emerald-400'
  if (pct >= 40) return 'text-amber-400'
  
return 'text-slate-400'
}

export function getMatchBgColor(pct: number): string {
  if (pct >= 70) return 'bg-emerald-500'
  if (pct >= 40) return 'bg-amber-500'
  
return 'bg-slate-600'
}
