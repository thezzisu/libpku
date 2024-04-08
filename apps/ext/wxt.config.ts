import vue from '@vitejs/plugin-vue'
import uno from 'unocss/vite'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: 'LibPKU Browser Extension',
    short_name: 'LibPKU',
    description: 'Browser extension to work with LibPKU',
    permissions: ['activeTab'],
    optional_permissions: ['cookies'],
    // @ts-expect-error This is a valid manifest key
    optional_host_permissions: ['*://*.pku.edu.cn/*']
  },
  imports: {
    addons: {
      vueTemplate: true
    }
  },
  vite: () => ({
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),
      vuetify({
        autoImport: true
      }),
      uno()
    ]
  })
})
