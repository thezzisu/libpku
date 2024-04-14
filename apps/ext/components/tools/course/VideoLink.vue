<template>
  <VCardSubtitle>获取课堂实录直链</VCardSubtitle>
  <VCardActions>
    <VBtn text="获取直链" @click="open" :loading="loading" />
  </VCardActions>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
async function open() {
  loading.value = true
  try {
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
    const template = `https://yjapise.pku.edu.cn/courseapi/v2/schedule/search-live-course-list?all=1&course_id={hqyCourseId}&sub_id={hqySubId}&with_sub_data=1`
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true })
    if (!tab.url) throw new Error('当前页面没有URL')
    const params = new URL(tab.url).searchParams
    const data = await fetch(
      template.replace(/\{[^}]+\}/g, (m) => params.get(m.slice(1, -1))!),
      { headers: { Authorization: `Bearer ${jwt}` } }
    ).then((res) => res.json())
    const { file_list } = JSON.parse(data.list[0].sub_content) as {
      file_list: { file_type: string; file_name: string }[]
    }
    const url = file_list?.find(({ file_type }) => file_type === '0_S_V1_mp4')?.file_name
    if (!url) throw new Error('未找到视频链接')
    await navigator.clipboard.writeText(url)
    alert('已复制视频链接')
  } catch (err) {
    alert(err)
  }
  loading.value = false
}
</script>
