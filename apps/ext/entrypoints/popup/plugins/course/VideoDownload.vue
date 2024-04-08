<template>
  <VCardSubtitle>下载课堂实录</VCardSubtitle>
  <template v-if="canDownload">
    <VCardText>
      下载配置后，执行如下命令以下载视频：
      <pre>npx @libpku/cli@latest batch request.json</pre>
      或者直接复制命令并在终端粘贴并执行。
    </VCardText>
    <VCardActions>
      <VBtn text="下载配置" @click="download" :loading="downloadLoading" />
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

async function download() {
  downloadLoading.value = true
  try {
    const data = await sendMessage('course:get-video-urls', undefined, ctx.value.tabId)
    const buffer = new TextEncoder().encode(JSON.stringify(data))
    const base64 = btoa(String.fromCharCode(...buffer))
    const command = ['course', 'video', base64]
    const blob = new Blob([JSON.stringify(command)], { type: 'application/json' })
    browser.downloads.download({
      url: URL.createObjectURL(blob),
      saveAs: true,
      filename: 'request.json'
    })
  } catch (err) {
    alert(`错误：${err}`)
  }
  downloadLoading.value = false
}

async function copy() {
  copyLoading.value = true
  try {
    const data = await sendMessage('course:get-video-urls', undefined, ctx.value.tabId)
    const buffer = new TextEncoder().encode(JSON.stringify(data))
    const base64 = btoa(String.fromCharCode(...buffer))
    const command = ['npx', '@libpku/cli@latest', 'course', 'video', base64]
    await navigator.clipboard.writeText(command.join(' '))
    alert('已复制命令')
  } catch (err) {
    alert(`错误：${err}`)
  }
  copyLoading.value = false
}
</script>
