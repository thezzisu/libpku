<template>
  <VCard flat class="u-min-w-96">
    <VCardTitle class="d-flex align-center">
      <div>Lib<b>PKU</b></div>
      <VBtn
        icon="mdi-github"
        variant="text"
        href="https://github.com/thezzisu/libpku"
        target="_blank"
      />
      <VSpacer />
      <VChip v-bind="site" />
    </VCardTitle>
    <AsyncState :state="activeTab">
      <template v-slot="{ value }">
        <VList>
          <VListItem
            :title="value.title"
            :subtitle="value.url"
            :prepend-avatar="value.favIconUrl"
          />
        </VList>
        <Plugins v-if="value.url" />
      </template>
    </AsyncState>
  </VCard>
</template>

<script lang="ts" setup>
import { useApp } from './App'
import Plugins from './plugins/Plugins.vue'

import AsyncState from '@/components/AsyncState.vue'

const { activeTab, site } = useApp()
</script>
