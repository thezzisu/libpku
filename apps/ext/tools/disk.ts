import { defineTools } from './common'

export default defineTools({
  matcher: ({ url }) => new URL(url).hostname === 'disk.pku.edu.cn',
  tools: [
    {
      id: 'DiskCurrent'
    },
    {
      id: 'DiskDownload'
    }
  ]
})
