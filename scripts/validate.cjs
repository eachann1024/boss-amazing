const fs = require('node:fs')
const path = require('node:path')
const { chromium } = require('playwright')

const extensionRoot = '/Users/eachann/Work/boss-amazing/boss-helper-lite/dist/dev'
const contentJs = path.join(extensionRoot, 'content-scripts', 'content.js')
const contentCss = path.join(extensionRoot, 'content-scripts', 'content.css')

if (!fs.existsSync(contentJs) || !fs.existsSync(contentCss)) {
  console.error('Built content scripts not found. Run pnpm build first.')
  process.exit(1)
}

const fixturePath = '/tmp/boss-helper-fixture.html'
const fixtureHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Boss Helper Lite Fixture</title>
    <style>
      body { font-family: sans-serif; padding: 24px; }
      .job-card { border: 1px solid #ddd; padding: 12px; margin-bottom: 12px; }
      .job-name { font-weight: 600; }
      .salary { color: #2563eb; }
    </style>
  </head>
  <body>
    <div class="job-card-wrapper">
      <div class="job-card">
        <div class="job-name">资深前端工程师</div>
        <div class="salary">20K-30K</div>
        <div class="company-name">测试公司A</div>
        <div class="job-desc">负责前端架构与性能优化，包含React、Vue等技术。</div>
        <button>聊一聊</button>
      </div>
      <div class="job-card">
        <div class="job-name">前端开发</div>
        <div class="salary">10K-15K</div>
        <div class="company-name">测试公司B</div>
        <div class="job-desc">需要电话销售能力（测试过滤）</div>
        <button>聊一聊</button>
      </div>
    </div>

    <div style="margin-top: 24px;">
      <textarea id="chat-input" placeholder="输入消息..." style="width: 100%; height: 80px;"></textarea>
      <button id="send-btn">发送</button>
    </div>
  </body>
</html>`

fs.writeFileSync(fixturePath, fixtureHtml)

const errors = []

;(async () => {
  const context = await chromium.launchPersistentContext(`/tmp/boss-helper-profile-${Date.now()}`, {
    headless: false,
    args: ['--allow-file-access-from-files'],
  })

  const page = await context.newPage()
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`)
  })

  await page.addInitScript(() => {
    const store = {}
    window.chrome = {
      runtime: {
        lastError: null,
        sendMessage: (message, callback) => {
          if (message.type === 'ai:score') {
            callback({ ok: true, content: JSON.stringify({ score: 80, reason: '匹配度高' }) })
            return
          }
          if (message.type === 'ai:greeting') {
            callback({ ok: true, content: '您好，看到贵司，希望进一步沟通。' })
            return
          }
          callback({ ok: false, error: '未知请求' })
        },
      },
      storage: {
        local: {
          get: (keys, callback) => {
            if (Array.isArray(keys)) {
              const result = {}
              keys.forEach((key) => { result[key] = store[key] })
              callback(result)
              return
            }
            if (typeof keys === 'string') {
              callback({ [keys]: store[keys] })
              return
            }
            callback(store)
          },
          set: (data, callback) => {
            Object.assign(store, data)
            callback && callback()
          },
        },
      },
    }
  })

  await page.goto(`file://${fixturePath}`, { waitUntil: 'domcontentloaded' })
  await page.addStyleTag({ path: contentCss })
  await page.addScriptTag({ path: contentJs })
  await page.waitForSelector('#boss-helper-lite-root', { timeout: 10000, state: 'attached' })

  const settingsBtn = page.getByTitle('Boss Helper Lite 设置')
  await settingsBtn.click({ timeout: 10000 })
  await page.waitForSelector('text=Boss Helper Lite · 设置')

  await page.getByRole('button', { name: '基础过滤' }).click({ force: true })
  const tagInput = page.getByPlaceholder('输入关键词后按 Enter').first()
  await tagInput.fill('测试排除')
  await tagInput.press('Enter')

  const activitySwitch = page.getByText('活跃度过滤').locator('..').locator('..').locator('button[role="switch"]')
  await activitySwitch.click({ force: true })

  await page.getByRole('button', { name: '薪资偏好' }).click({ force: true })
  const minInput = page.locator('input[type="number"]').nth(0)
  const maxInput = page.locator('input[type="number"]').nth(1)
  await minInput.fill('20')
  await maxInput.fill('40')

  await page.getByRole('button', { name: 'AI 配置' }).click({ force: true })
  await page.locator('button:has-text("OpenAI")').click({ force: true })
  await page.locator('div[role="option"]:has-text("Anthropic")').click({ force: true })
  await page.getByPlaceholder('sk-...').fill('test-key')

  await page.getByRole('button', { name: '我的简历' }).click({ force: true })
  await page.getByPlaceholder('粘贴你的简历内容...').fill('简历测试内容')

  await page.getByRole('button', { name: '打招呼模板' }).click({ force: true })
  await page.locator('textarea').first().fill('您好，看到贵司{{公司名}}，想进一步沟通。')
  const greetingSwitch = page.getByText('启用变量渲染').locator('..').locator('button[role="switch"]')
  await greetingSwitch.click({ force: true })

  await page.getByRole('button', { name: '一键投递' }).click({ force: true })
  await page.getByRole('button', { name: '开始投递' }).click({ force: true })
  await page.waitForTimeout(1000)

  await page.getByRole('button', { name: '保存设置' }).click({ force: true })
  await page.waitForTimeout(1000)

  await context.close()

  if (errors.length > 0) {
    console.error('Errors:', errors)
    process.exit(1)
  }

  console.log('Validation completed without console/page errors.')
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
