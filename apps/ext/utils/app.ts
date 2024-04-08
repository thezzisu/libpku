import 'virtual:uno.css'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createApp as _createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'
import { zhHans, en } from 'vuetify/locale'

export function createApp(...args: Parameters<typeof _createApp>) {
  const app = _createApp(...args)
  const vuetify = createVuetify({
    blueprint: md3,
    locale: {
      locale: 'zh-Hans',
      fallback: 'en',
      messages: { 'zh-Hans': zhHans, en }
    },
    icons: {
      sets: {
        svg: {} as never
      }
    }
  })
  return app.use(vuetify)
}
