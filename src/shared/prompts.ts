import type { JobCard, Settings } from '@/shared/types'

const EXTRA_SKILLS = [
  'MongoDB',
  'PostgreSQL',
  'Nginx',
  'Docker',
  '腾讯云',
  '阿里云',
  'Supabase',
  'Vercel',
]

export function buildGreetingPrompt(settings: Settings, job: JobCard) {
  const resume = settings.resume.trim()
  const jobInfo = formatJobInfo(job)
  return `你是求职者，请根据简历与岗位信息生成打招呼语。\n\n要求：\n- 只输出打招呼语正文，不要解释、不要标题、不要JSON。\n- 必须以“您好，看到贵司”开头，不要带岗位标题。\n- 不卑不亢，不要哀求，也不要高傲。\n- 不要伪造简历外的技能与经历。\n- 可按需补充以下知识面（仅在确实合理时使用）：${EXTRA_SKILLS.join('、')}。\n\n我的简历：\n${resume}\n\n待处理岗位信息：\n${jobInfo}\n`
}

export function buildScorePrompt(settings: Settings, job: JobCard) {
  const resume = settings.resume.trim()
  const jobInfo = formatJobInfo(job)
  return `你是求职岗位匹配评估助手。请根据简历与岗位信息打分。\n\n输出要求：\n- 只输出 JSON，不能输出其他文字。\n- JSON格式：{ "score": number, "reason": string }，score 0-100。\n\n评分规则：\n- 业务、技术栈、经验年限、项目类型越贴合分数越高。\n- 明显不匹配或方向冲突直接给低分（<=40）。\n\n我的简历：\n${resume}\n\n待处理岗位信息：\n${jobInfo}\n`
}

function formatJobInfo(job: JobCard) {
  const skills = job.skills?.join('、') ?? ''
  const labels = job.jobLabels?.join('、') ?? ''
  const desc = job.postDescription ?? ''
  return `<岗位信息>
岗位名:${job.jobName}
薪资:${job.salaryDesc}
学历要求:${job.degreeName ?? ''}
技能要求:${skills}
岗位标签:${labels}
<岗位描述>
${desc}
<岗位描述/>
</岗位信息>`
}
