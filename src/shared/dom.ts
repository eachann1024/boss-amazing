import type { JobCard } from '@/shared/types'

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function waitForElement<T extends Element>(selector: string, timeoutMs = 8000): Promise<T | null> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const el = document.querySelector(selector) as T | null
    if (el) return el
    await sleep(200)
  }
  return null
}

export function findJobCards(): HTMLElement[] {
  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>('[ka*="job-card"], .job-card-wrapper, .job-card, .job-primary')
  )
  return candidates.filter((el) => el.innerText.includes('薪资') || el.innerText.includes('K'))
}

export function extractJobCard(card: HTMLElement): JobCard {
  const jobName = text(card, '.job-name, .job-title, .name') || text(card, 'h3') || '未知岗位'
  const salaryDesc = text(card, '.salary, .salary-text, .job-salary') || fallbackSalary(card)
  const companyName = text(card, '.company-name, .company-text, .company')
  const hrName = text(card, '.boss-name, .hr-name')
  const hrTitle = text(card, '.boss-title, .hr-title')
  const activeText = text(card, '.boss-active, .active-time')
  const labels = Array.from(card.querySelectorAll('.tag, .labels span, .job-tags span')).map((el) => el.textContent?.trim()).filter(Boolean) as string[]
  const postDescription = text(card, '.job-detail, .job-desc, .job-description')

  return {
    jobName: jobName.trim(),
    salaryDesc: salaryDesc.trim(),
    companyName: companyName?.trim(),
    hrName: hrName?.trim(),
    hrTitle: hrTitle?.trim(),
    hrActiveText: activeText?.trim(),
    jobLabels: labels,
    postDescription: postDescription?.trim(),
    isHeadhunter: labels.some((label) => label.includes('猎头')),
    isFriend: card.innerText.includes('已聊') || card.innerText.includes('已沟通'),
  }
}

export function findChatInput(): HTMLTextAreaElement | HTMLInputElement | HTMLElement | null {
  const textarea = document.querySelector('textarea')
  if (textarea) return textarea
  const input = document.querySelector('input[type="text"]')
  if (input) return input
  const editable = document.querySelector('[contenteditable="true"]')
  return editable as HTMLElement | null
}

export function findSendButton(): HTMLButtonElement | null {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('button'))
  return buttons.find((btn) => btn.innerText.includes('发送') || btn.innerText.includes('立即沟通')) || null
}

export function clickCardAction(card: HTMLElement) {
  const action = findButtonByText(card, ['立即沟通', '继续沟通', '聊一聊', '沟通'])
  action?.click()
}

export function findButtonByText(root: ParentNode, texts: string[]) {
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('button'))
  return buttons.find((btn) => texts.some((t) => btn.innerText.includes(t))) || null
}

function text(root: ParentNode, selector: string) {
  const el = root.querySelector(selector)
  return el?.textContent || ''
}

function fallbackSalary(root: ParentNode) {
  const textContent = root.textContent || ''
  const match = textContent.match(/\d+\s*[-~]\s*\d+\s*K/i)
  return match?.[0] || ''
}
