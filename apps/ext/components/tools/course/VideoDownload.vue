<template>
  <VCardSubtitle>下载课堂实录</VCardSubtitle>
  <VCardText> 复制命令后在终端中执行即可。 </VCardText>
  <VCardActions>
    <VBtn text="复制命令" @click="copy" :loading="copyLoading" />
  </VCardActions>
</template>

<script setup lang="ts">
import { useVideoDownload } from './VideoDownload'

const { copy, copyLoading } = useVideoDownload()
</script>
