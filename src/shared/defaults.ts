import type { Settings, Stats } from '@/shared/types'

export const DEFAULT_RESUME = ''

export const DEFAULT_GREETING_TEMPLATE = `您好，看到贵司{{公司名}}，希望进一步沟通。`

export const DEFAULT_SETTINGS: Settings = {
  jobTitleFilter: {
    enabled: true,
    values: ['外包', '实习', '派遣', '保险'],
  },
  jobContentFilter: {
    enabled: true,
    values: ['电话销售', '地推', '驻场'],
  },
  salaryRange: {
    enabled: true,
    minK: 15,
    maxK: 35,
  },
  filters: {
    activityFilter: true,
    headhunterFilter: true,
    friendFilter: false,
    sameCompanyFilter: true,
    sameHrFilter: true,
  },
  ai: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
    scoreThreshold: 60,
  },
  resume: DEFAULT_RESUME,
  greeting: {
    useVariables: false,
    template: DEFAULT_GREETING_TEMPLATE,
  },
  version: '2026-02-26',
}

export const DEFAULT_STATS: Stats = {
  total: 0,
  sent: 0,
  filtered: 0,
  failed: 0,
  reasons: {},
}
