import { Settings2, Sliders, Sparkles, FileText, MessageSquare, BarChart3, PlayCircle } from 'lucide-react'
import type { FilterFlags } from '@/shared/types'

export const SETTINGS_NAV = [
  { id: 'basic', label: '基础过滤', icon: Settings2, group: '过滤设置' },
  { id: 'salary', label: '薪资偏好', icon: Sliders, group: '过滤设置' },
  { id: 'ai', label: 'AI 配置', icon: Sparkles, group: 'AI 设置' },
  { id: 'resume', label: '我的简历', icon: FileText, group: 'AI 设置' },
  { id: 'greeting', label: '打招呼模板', icon: MessageSquare, group: 'AI 设置' },
  { id: 'run', label: '一键投递', icon: PlayCircle, group: '自动化' },
  { id: 'stats', label: '投递统计', icon: BarChart3, group: '自动化' },
] as const

export const PAGE_META = {
  basic: {
    title: '基础过滤',
    description: '通过关键词和规则快速过滤不匹配岗位。',
  },
  salary: {
    title: '薪资偏好',
    description: '设置可接受的薪资区间，提升岗位匹配精度。',
  },
  ai: {
    title: 'AI 配置',
    description: '配置模型和密钥，用于岗位评估与招呼语生成。',
  },
  resume: {
    title: '我的简历',
    description: '填写简历内容，作为 AI 生成个性化内容的输入。',
  },
  greeting: {
    title: '打招呼模板',
    description: '基于模板变量生成更贴合岗位的信息。',
  },
  run: {
    title: '一键投递',
    description: '从筛选到打招呼，全流程自动执行。',
  },
  stats: {
    title: '投递统计',
    description: '查看本次会话内的投递与过滤结果。',
  },
} as const

export const KEYWORD_FILTER_META = {
  jobTitle: {
    label: '岗位名称排除词',
    description: '岗位标题命中以下关键词时将跳过。',
  },
  jobContent: {
    label: '工作内容排除词',
    description: '岗位描述命中以下关键词时将跳过。',
  },
} as const

export const FILTER_SWITCH_META: Array<{
  key: keyof FilterFlags
  label: string
  description: string
}> = [
  { key: 'activityFilter', label: '活跃度过滤', description: '仅对近期活跃 HR 发起沟通。' },
  { key: 'headhunterFilter', label: '猎头过滤', description: '自动过滤猎头发布岗位。' },
  { key: 'friendFilter', label: '好友过滤（已聊）', description: '跳过已沟通过岗位。' },
  { key: 'sameCompanyFilter', label: '相同公司过滤', description: '同公司岗位仅投递一次。' },
  { key: 'sameHrFilter', label: '相同 HR 过滤', description: '同一 HR 不重复打招呼。' },
]

export const GREETING_VARIABLES = [
  { name: '{{岗位名}}', desc: '岗位名称' },
  { name: '{{公司名}}', desc: '公司名称' },
  { name: '{{薪资}}', desc: '薪资范围' },
  { name: '{{城市}}', desc: '工作城市' },
  { name: '{{HR}}', desc: 'HR 名称' },
] as const
