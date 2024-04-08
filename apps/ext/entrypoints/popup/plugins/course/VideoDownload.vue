<template>
  <VCardSubtitle>下载课堂实录</VCardSubtitle>
  <template v-if="canDownload">
    <VCardText> 复制命令后在终端中执行即可。 </VCardText>
    <VCardActions>
      <VBtn text="复制命令" @click="copy" :loading="copyLoading" />
    </VCardActions>
  </template>
  <VCardText v-else>
    <VAlert text="该功能需要在课堂实录列表页面使用" />
  </VCardText>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { useAppCtx } from '../../App'

const ctx = useAppCtx()
const canDownload = computed(
  () => new URL(ctx.value.url).pathname === '/webapps/bb-streammedia-hqy-BBLEARN/videoList.action'
)
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
  if (!cookie) throw new Error('未找到 Cookie')
  const token = decodeURIComponent(cookie.value)
  const jwt = /{i:\d+;s:\d+:"_token";i:\d+;s:\d+:"(.+?)";}/.exec(token)![1]
  const html = await fetch(ctx.value.url).then((r) => r.text())
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
        save_playback: { contents }
      } = JSON.parse(sub_content)
      return { title, subTitle: sub_title, url: contents }
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
</script>
