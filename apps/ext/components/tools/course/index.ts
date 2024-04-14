import { defineToolsComponents } from '../common'

import VideoDownload from './VideoDownload.vue'
import VideoLink from './VideoLink.vue'

export default defineToolsComponents({
  prefix: 'Course',
  components: {
    VideoDownload,
    VideoLink
  }
})
