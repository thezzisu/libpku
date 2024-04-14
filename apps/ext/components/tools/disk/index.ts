import { defineToolsComponents } from '../common'

import Current from './Current.vue'
import Download from './Download.vue'

export default defineToolsComponents({
  prefix: 'Disk',
  components: {
    Current,
    Download
  }
})
