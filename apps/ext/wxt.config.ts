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
    permissions: ['tabs', 'downloads']
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
