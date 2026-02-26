import type { JobCard, PipelineResult, Settings } from '@/shared/types'
import { matchActivity, matchFriend, matchHeadhunter, matchJobContent, matchJobTitle, matchSalary } from '@/shared/filters'
import { buildGreetingPrompt, buildScorePrompt } from '@/shared/prompts'
import { parseScore, sanitizeGreeting } from '@/shared/ai'

export type AIClient = {
  score(prompt: string): Promise<string>
  greeting(prompt: string): Promise<string>
}

export async function runPipeline(
  job: JobCard,
  settings: Settings,
  history: { companies: Set<string>; hrs: Set<string> },
  ai: AIClient,
  options?: { skipGreeting?: boolean }
): Promise<PipelineResult> {
  const titleMatch = matchJobTitle(settings, job)
  if (titleMatch) return { status: 'filtered', reason: titleMatch }

  const contentMatch = matchJobContent(settings, job)
  if (contentMatch) return { status: 'filtered', reason: contentMatch }

  const salaryMatch = matchSalary(settings, job)
  if (salaryMatch) return { status: 'filtered', reason: salaryMatch }

  const activityMatch = matchActivity(settings, job)
  if (activityMatch) return { status: 'filtered', reason: activityMatch }

  const headhunterMatch = matchHeadhunter(settings, job)
  if (headhunterMatch) return { status: 'filtered', reason: headhunterMatch }

  const friendMatch = matchFriend(settings, job)
  if (friendMatch) return { status: 'filtered', reason: friendMatch }

  if (settings.filters.sameCompanyFilter && job.companyName) {
    if (history.companies.has(job.companyName)) {
      return { status: 'filtered', reason: '相同公司过滤' }
    }
  }

  if (settings.filters.sameHrFilter && job.hrName) {
    if (history.hrs.has(job.hrName)) {
      return { status: 'filtered', reason: '相同HR过滤' }
    }
  }

  const scorePrompt = buildScorePrompt(settings, job)
  const scoreContent = await ai.score(scorePrompt)
  const { score, reason } = parseScore(scoreContent)
  if (score < settings.ai.scoreThreshold) {
    return { status: 'filtered', reason: reason || 'AI评分未通过', score }
  }

  if (!options?.skipGreeting) {
    const greetingPrompt = buildGreetingPrompt(settings, job)
    const greetingRaw = await ai.greeting(greetingPrompt)
    const greeting = sanitizeGreeting(greetingRaw, job.jobName)
    return { status: 'sent', greeting, score }
  }

  return { status: 'sent', score }
}
