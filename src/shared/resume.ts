type ResumeBaseInfo = {
  nickName?: string
  age?: string | number
  gender?: number
  degreeCategory?: string
  workYearDesc?: string
}

type ResumeExpect = {
  positionType?: number
  positionName?: string
  salaryDesc?: string
}

type ResumeWorkExp = {
  companyName?: string
  positionName?: string
  startDate?: string
  endDate?: string
  emphasis?: string[]
  workContent?: string
  workPerformance?: string
}

type ResumeProjectExp = {
  name?: string
  roleName?: string
  startDate?: string
  endDate?: string
  projectDesc?: string
  performance?: string
}

type ResumeEducationExp = {
  school?: string
  startYear?: string | number
  endYear?: string | number
  degreeName?: string
}

type ResumeCertificate = {
  certName?: string
}

type ResumeVolunteer = {
  name?: string
  serviceLength?: string
  volunteerDesc?: string
  volunteerDescription?: string
}

type BossResumeData = {
  baseInfo?: ResumeBaseInfo
  applyStatus?: number
  userDesc?: string
  expectList?: ResumeExpect[]
  workExpList?: ResumeWorkExp[]
  projectExpList?: ResumeProjectExp[]
  educationExpList?: ResumeEducationExp[]
  certificationList?: ResumeCertificate[]
  volunteerExpList?: ResumeVolunteer[]
}

type BossResumeResponse = {
  code: number
  message?: string
  zpData?: BossResumeData
}

function getCookie(name: string): string | null {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function normalizeText(value: unknown) {
  if (value === undefined || value === null) return ''
  return String(value).trim()
}

function normalizeApplyStatus(status?: number) {
  switch (status) {
    case 0:
      return '离职-随时到岗'
    case 1:
      return '在职-暂不考虑'
    case 2:
      return '在职-考虑机会'
    case 3:
      return '在职-月内到岗'
    default:
      return ''
  }
}

function formatResumeMarkdown(data: BossResumeData) {
  const lines: string[] = []
  const base = data.baseInfo ?? {}
  const baseInfoLines: string[] = []

  if (normalizeText(base.age)) baseInfoLines.push(`- 年龄: ${normalizeText(base.age)}`)
  if (base.gender === 1 || base.gender === 2) baseInfoLines.push(`- 性别: ${base.gender === 1 ? '男' : '女'}`)
  if (normalizeText(base.degreeCategory)) baseInfoLines.push(`- 学历: ${normalizeText(base.degreeCategory)}`)
  if (normalizeText(base.workYearDesc)) baseInfoLines.push(`- 工作年限: ${normalizeText(base.workYearDesc)}`)
  const apply = normalizeApplyStatus(data.applyStatus)
  if (apply) baseInfoLines.push(`- 求职状态: ${apply}`)

  if (baseInfoLines.length > 0) {
    lines.push('## 基本信息')
    lines.push(...baseInfoLines)
  }

  const expectList = (data.expectList ?? []).filter(item => item?.positionType === 0)
  if (expectList.length > 0) {
    lines.push('', '## 期望职位')
    lines.push(...expectList.map(item => `- ${normalizeText(item.positionName)} ${normalizeText(item.salaryDesc)}`.trim()))
  }

  if (normalizeText(data.userDesc)) {
    lines.push('', '## 个人优势', '', '<个人优势>', normalizeText(data.userDesc), '</个人优势>')
  }

  if ((data.workExpList ?? []).length > 0) {
    lines.push('', '## 工作经历')
    for (const item of data.workExpList ?? []) {
      lines.push(
        '',
        `### ${normalizeText(item.companyName)} (${normalizeText(item.positionName)}) ${normalizeText(item.startDate)}-${normalizeText(item.endDate)}`.trim(),
      )
      if ((item.emphasis ?? []).length > 0) {
        lines.push(`相关技能: ${(item.emphasis ?? []).map(skill => `\`${normalizeText(skill)}\``).join(' ')}`)
      }
      if (normalizeText(item.workContent)) {
        lines.push('<工作内容>', normalizeText(item.workContent), '</工作内容>')
      }
      if (normalizeText(item.workPerformance)) {
        lines.push('<工作业绩>', normalizeText(item.workPerformance), '</工作业绩>')
      }
    }
  }

  if ((data.projectExpList ?? []).length > 0) {
    lines.push('', '## 项目经历')
    for (const item of data.projectExpList ?? []) {
      lines.push(
        '',
        `### ${normalizeText(item.name)} (${normalizeText(item.roleName)}) ${normalizeText(item.startDate)}-${normalizeText(item.endDate)}`.trim(),
      )
      if (normalizeText(item.projectDesc)) {
        lines.push('<项目描述>', normalizeText(item.projectDesc), '</项目描述>')
      }
      if (normalizeText(item.performance)) {
        lines.push('<项目业绩>', normalizeText(item.performance), '</项目业绩>')
      }
    }
  }

  if ((data.educationExpList ?? []).length > 0) {
    lines.push('', '## 教育经历')
    lines.push(
      ...(data.educationExpList ?? []).map(item =>
        `- ${normalizeText(item.school)} ${normalizeText(item.startYear)}-${normalizeText(item.endYear)} ${normalizeText(item.degreeName)}`.trim(),
      ),
    )
  }

  if ((data.certificationList ?? []).length > 0) {
    lines.push('', '## 资格证书')
    lines.push(...(data.certificationList ?? []).map(item => `- ${normalizeText(item.certName)}`))
  }

  if ((data.volunteerExpList ?? []).length > 0) {
    lines.push('', '## 志愿者经历')
    lines.push(...(data.volunteerExpList ?? []).map((item) => {
      const desc = normalizeText(item.volunteerDesc || item.volunteerDescription)
      return `- ${normalizeText(item.name)} ${normalizeText(item.serviceLength)} ${desc}`.trim()
    }))
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

export async function loadBossResumeMarkdown(): Promise<string> {
  const token = getCookie('bst')
  const response = await fetch(`https://www.zhipin.com/wapi/zpgeek/resume/geek/preview/data.json?_=${Date.now()}`, {
    credentials: 'include',
    headers: token ? { Zp_token: token } : undefined,
  })

  if (!response.ok) {
    throw new Error(`读取简历失败: ${response.status}`)
  }

  const payload = await response.json() as BossResumeResponse
  if (payload.code !== 0 || !payload.zpData) {
    throw new Error(payload.message || '未登录或简历不可读取')
  }

  const markdown = formatResumeMarkdown(payload.zpData)
  if (!markdown) {
    throw new Error('简历内容为空')
  }
  return markdown
}
