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
import { computed } from 'vue'

import { useAppCtx } from '../../App'

const ctx = useAppCtx()

const gns = computed(() => {
  const params = new URL(ctx.value.url).searchParams
  return params.get('item_id') || (params.has('gns') && `gns://${params.get('gns')}`) || ''
})

function copy() {
  navigator.clipboard
    .writeText(gns.value ?? '')
    .then(() => alert('已复制到剪贴板'))
    .catch(() => alert('复制失败'))
}
</script>
