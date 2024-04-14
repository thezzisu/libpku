<template>
  <VCardSubtitle>当前文档GNS标识</VCardSubtitle>
  <VCardText>
    <VTextField
      :model-value="gns"
      readonly
      append-inner-icon="mdi-content-copy"
      @click:append-inner="copy"
    />
  </VCardText>
</template>

<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { computed } from 'vue'

const url = useAsyncState(async () => {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true })
  return tab.url ?? ''
}, '')

const gns = computed(() => {
  if (!url.state.value) return ''
  const params = new URL(url.state.value).searchParams
  return params.get('item_id') || (params.has('gns') && `gns://${params.get('gns')}`) || ''
})

function copy() {
  navigator.clipboard
    .writeText(gns.value ?? '')
    .then(() => alert('已复制到剪贴板'))
    .catch(() => alert('复制失败'))
}
</script>
