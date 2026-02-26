import type { JobCard, Settings } from '@/shared/types'

export function matchJobTitle(settings: Settings, job: JobCard) {
  if (!settings.jobTitleFilter.enabled) return null
  const name = job.jobName?.toLowerCase() || ''
  for (const keyword of settings.jobTitleFilter.values) {
    if (!keyword) continue
    if (name.includes(keyword.toLowerCase())) {
      return `岗位名包含排除词: ${keyword}`
    }
  }
  return null
}

export function matchJobContent(settings: Settings, job: JobCard) {
  if (!settings.jobContentFilter.enabled) return null
  const content = job.postDescription?.toLowerCase() || ''
  for (const keyword of settings.jobContentFilter.values) {
    if (!keyword) continue
    const lower = keyword.toLowerCase()
    const index = content.indexOf(lower)
    if (index >= 0) {
      const before = content.slice(Math.max(0, index - 5), index)
      if (/[不无]/.test(before)) {
        continue
      }
      return `工作内容包含排除词: ${keyword}`
    }
  }
  return null
}

export function matchSalary(settings: Settings, job: JobCard) {
  if (!settings.salaryRange.enabled) return null
  const { minK, maxK } = settings.salaryRange
  const parsed = parseSalaryRange(job.salaryDesc)
  if (!parsed) return null
  const [min, max] = parsed
  if (max < minK || min > maxK) {
    return `薪资不在范围: ${job.salaryDesc}`
  }
  return null
}

export function matchActivity(settings: Settings, job: JobCard) {
  if (!settings.filters.activityFilter) return null
  const text = job.hrActiveText
  if (!text) return null
  if (text.includes('月') || text.includes('年')) {
    return `活跃度低: ${text}`
  }
  return null
}

export function matchHeadhunter(settings: Settings, job: JobCard) {
  if (!settings.filters.headhunterFilter) return null
  if (job.isHeadhunter) return '猎头过滤'
  const tags = (job.jobLabels || []).join(' ')
  if (tags.includes('猎头')) return '猎头过滤'
  return null
}

export function matchFriend(settings: Settings, job: JobCard) {
  if (!settings.filters.friendFilter) return null
  if (job.isFriend) return '已聊过滤'
  return null
}

export function parseSalaryRange(text: string): [number, number] | null {
  if (!text) return null
  if (text.includes('面议')) return null

  const normalized = text.replace(/\s/g, '')
  const kMatch = normalized.match(/(\d+(?:\.\d+)?)[-~](\d+(?:\.\d+)?)(k|K)/)
  if (kMatch) {
    return [Number(kMatch[1]), Number(kMatch[2])]
  }
  const wMatch = normalized.match(/(\d+(?:\.\d+)?)[-~](\d+(?:\.\d+)?)(万)/)
  if (wMatch) {
    return [Number(wMatch[1]) * 10, Number(wMatch[2]) * 10]
  }
  const singleMatch = normalized.match(/(\d+(?:\.\d+)?)(k|K)/)
  if (singleMatch) {
    const val = Number(singleMatch[1])
    return [val, val]
  }
  return null
}
