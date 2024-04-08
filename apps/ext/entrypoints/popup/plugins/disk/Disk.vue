<template>
  <VCard v-if="isDisk" flat title="北大网盘工具">
    <Current />
    <Download />
  </VCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useAppCtx } from '../../App'

import Current from './Current.vue'
import Download from './Download.vue'

const ctx = useAppCtx()

const isDisk = computed(() => new URL(ctx.value.url).hostname === 'disk.pku.edu.cn')
</script>
