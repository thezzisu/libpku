import { defineTools } from './common'

export default defineTools({
  matcher: ({ url }) => new URL(url).hostname === 'course.pku.edu.cn',
  tools: [
    {
      matcher: ({ url }) =>
        new URL(url).pathname === '/webapps/bb-streammedia-hqy-BBLEARN/videoList.action',
      id: 'CourseVideoDownload'
    },
    {
      matcher: ({ url }) =>
        new URL(url).pathname === '/webapps/bb-streammedia-hqy-BBLEARN/playVideo.action',
      id: 'CourseVideoLink'
    }
  ]
})
