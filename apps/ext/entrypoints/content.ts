import { onMessage } from '@/utils/message'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const cookieStore: any

export default defineContentScript({
  matches: ['*://*.pku.edu.cn/*'],
  async main() {
    onMessage('course:get-video-urls', async () => {
      const cookie = await cookieStore.get('_token')
      const token = decodeURIComponent(cookie.value)
      const jwt = /{i:\d+;s:\d+:"_token";i:\d+;s:\d+:"(.+?)";}/.exec(token)![1]
      const selector =
        'tr[id^=listContainer_row] > td:nth-child(4) > span.table-data-cell-value > a'
      const url = `https://yjapise.pku.edu.cn/courseapi/v2/schedule/search-live-course-list?all=1&course_id={hqyCourseId}&sub_id={hqySubId}&with_sub_data=1`
      const list = [...document.querySelectorAll(selector)]
        .map((a) => (a as HTMLAnchorElement).href)
        .map((u) => new URL(u).searchParams)
        .map((s) => url.replace(/\{[^}]+\}/g, (m) => s.get(m.slice(1, -1))!))
        .map((u) => fetch(u, { headers: { Authorization: `Bearer ${jwt}` } }))
        .map((p) => p.then((r) => r.json()))
      const resp = await Promise.all(list)
      const videos = resp
        .flatMap((i) => i.list)
        .map(({ title, sub_title, sub_content }) => {
          const {
            save_playback: { contents }
          } = JSON.parse(sub_content)
          return { title, subTitle: sub_title, url: contents }
        })
      return { token, videos }
    })

    onMessage('disk:get-download-url', async (msg) => {
      const { gns } = msg.data
      const cookie = await cookieStore.get('client.oauth2_token')
      const token = decodeURIComponent(cookie.value)
      const { namepath } = await fetch('https://disk.pku.edu.cn/api/efast/v1/file/convertpath', {
        headers: { authorization: `Bearer ${token}` },
        referrer: 'https://disk.pku.edu.cn/',
        body: JSON.stringify({ docid: gns }),
        method: 'POST'
      }).then((r) => r.json())
      const savename = namepath.split('/').pop() ?? 'out'
      const body = {
        docid: gns,
        authtype: 'QUERY_STRING',
        savename: savename,
        usehttps: true,
        rev: ''
      }
      const { authrequest } = await fetch('https://disk.pku.edu.cn/api/efast/v1/file/osdownload', {
        headers: { authorization: `Bearer ${token}` },
        referrer: 'https://disk.pku.edu.cn/',
        body: JSON.stringify(body),
        method: 'POST'
      }).then((r) => r.json())
      const url = authrequest[1]
      return { path: namepath, url }
    })

    console.log('[LibPKU] content script loaded')
  }
})
