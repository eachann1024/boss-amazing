import { defineConfig } from 'wxt'
// NOTE: code-inspector-plugin causes Node-side pre-render crash in WXT dev (Document is not defined).
// Keep it disabled here; re-enable only after verifying SSR/Node compatibility.

export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',
  modules: ['@wxt-dev/module-react'],
  webExt: {
    startUrls: ['https://www.zhipin.com/'],
  },
  manifest: {
    name: 'Boss Awesome',
    description: '简化版 Boss 直聘投递助手',
    version: '0.1.0',
    permissions: ['storage', 'activeTab'],
    host_permissions: ['<all_urls>'],
  },
  vite: () => ({
    define: {
      __APP_VERSION__: JSON.stringify('0.1.0'),
    },
  }),
})
