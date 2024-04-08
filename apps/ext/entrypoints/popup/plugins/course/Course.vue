<template>
  <VCard v-if="isCourse" flat title="教学网工具">
    <VideoDownload />
  </VCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useAppCtx } from '../../App'

import VideoDownload from './VideoDownload.vue'

const ctx = useAppCtx()

const isCourse = computed(() => new URL(ctx.value.url).hostname === 'course.pku.edu.cn')
</script>
