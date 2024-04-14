import { ref } from 'vue'

export function useVideoDownload() {
  const downloadLoading = ref(false)
  const copyLoading = ref(false)

  async function extract() {
    const granted = await browser.permissions.request({
      origins: ['*://course.pku.edu.cn/*'],
      permissions: ['cookies']
    })
    if (!granted) throw new Error('未授权')
    const cookie = await browser.cookies.get({
      url: 'https://course.pku.edu.cn',
      name: '_token'
    })
    if (!cookie) throw new Error('未找到Cookie!请先看一个视频再重试')
    const token = decodeURIComponent(cookie.value)
    const jwt = /{i:\d+;s:\d+:"_token";i:\d+;s:\d+:"(.+?)";}/.exec(token)![1]
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true })
    if (!tab.url) throw new Error('当前页面没有URL')
    const html = await fetch(tab.url).then((r) => r.text())
    const parser = new DOMParser()
    const dom = parser.parseFromString(html, 'text/html')
    const selector = 'tr[id^=listContainer_row] > td:nth-child(4) > span.table-data-cell-value > a'
    const url = `https://yjapise.pku.edu.cn/courseapi/v2/schedule/search-live-course-list?all=1&course_id={hqyCourseId}&sub_id={hqySubId}&with_sub_data=1`
    const list = [...dom.querySelectorAll(selector)]
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
          save_playback: { contents },
          file_list
        } = JSON.parse(sub_content) as {
          save_playback: { contents: string }
          file_list: { file_type: string; file_name: string }[]
        }
        const sources = [
          file_list?.find(({ file_type }) => file_type === '0_S_V1_mp4')?.file_name,
          contents
        ]
        return { title, subTitle: sub_title, url: sources.reduce((a, b) => a || b) }
      })
    const data = { token, videos }
    const buffer = new TextEncoder().encode(JSON.stringify(data))
    const base64 = btoa(String.fromCharCode(...buffer))
    return { data, buffer, base64 }
  }

  async function copy() {
    copyLoading.value = true
    try {
      const { base64 } = await extract()
      const command = ['npx', '@libpku/cli@latest', 'course', 'video', base64]
      await navigator.clipboard.writeText(command.join(' '))
      alert('已复制命令')
    } catch (err) {
      alert(`错误：${err}`)
    }
    copyLoading.value = false
  }

  return { downloadLoading, copyLoading, copy }
}
