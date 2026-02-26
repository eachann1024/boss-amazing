export type ProviderType = 'openai' | 'anthropic' | 'deepseek' | 'moonshot' | 'custom'

export type SalaryRange = {
  enabled: boolean
  minK: number
  maxK: number
}

export type KeywordFilter = {
  enabled: boolean
  values: string[]
}

export type FilterFlags = {
  activityFilter: boolean
  headhunterFilter: boolean
  friendFilter: boolean
  sameCompanyFilter: boolean
  sameHrFilter: boolean
}

export type AiConfig = {
  provider: ProviderType
  model: string
  apiKey: string
  baseUrl?: string
  scoreThreshold: number
}

export type GreetingConfig = {
  useVariables: boolean
  template: string
}

export type Settings = {
  jobTitleFilter: KeywordFilter
  jobContentFilter: KeywordFilter
  salaryRange: SalaryRange
  filters: FilterFlags
  ai: AiConfig
  resume: string
  greeting: GreetingConfig
  version: string
}

export type JobCard = {
  jobId?: string
  jobName: string
  salaryDesc: string
  degreeName?: string
  skills?: string[]
  jobLabels?: string[]
  postDescription?: string
  companyName?: string
  companyId?: string
  hrName?: string
  hrTitle?: string
  hrId?: string
  hrActiveText?: string
  cityName?: string
  isHeadhunter?: boolean
  isFriend?: boolean
}

export type PipelineStatus = 'filtered' | 'sent' | 'error' | 'skipped'

export type PipelineResult = {
  status: PipelineStatus
  reason?: string
  greeting?: string
  score?: number
}

export type Stats = {
  total: number
  sent: number
  filtered: number
  failed: number
  lastRunAt?: number
  reasons: Record<string, number>
}

export type RunState = {
  running: boolean
  currentIndex: number
  total: number
  message?: string
}
