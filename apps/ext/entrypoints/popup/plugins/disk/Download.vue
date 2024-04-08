<template>
  <VCardSubtitle>下载GNS标识</VCardSubtitle>
  <VCardText>
    <VTextField label="GNS" v-model="gns" />
  </VCardText>
  <VCardActions>
    <VBtn :loading="loading" :disabled="!gns" @click="getLink">获取下载链接</VBtn>
  </VCardActions>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useAppCtx } from '../../App'

const ctx = useAppCtx()

const gns = ref('')
const loading = ref(false)

async function getLink() {
  const link = await sendMessage('disk:get-download-url', { gns: gns.value }, ctx.value.tabId)
  navigator.clipboard
    .writeText(link.url)
    .then(() => alert('已复制到剪贴板'))
    .catch(() => alert('复制失败'))
}
</script>
