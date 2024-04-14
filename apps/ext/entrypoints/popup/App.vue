<template>
  <VCard flat rounded="0" class="u-min-w-96">
    <VToolbar>
      <VToolbarTitle>Lib<b>PKU</b></VToolbarTitle>
      <VToolbarItems>
        <VBtn
          icon="mdi-help-circle-outline"
          variant="text"
          href="https://libpku.zisu.dev"
          target="_blank"
        />
        <VBtn
          icon="mdi-github"
          variant="text"
          href="https://github.com/thezzisu/libpku"
          target="_blank"
        />
      </VToolbarItems>
    </VToolbar>
    <AsyncState :state="state">
      <template v-slot="{ value }">
        <VList>
          <VListItem
            :title="value.tab.title"
            :subtitle="value.tab.url"
            :prepend-avatar="value.tab.favIconUrl"
          >
            <template #append>
              <VChip v-bind="site" />
            </template>
          </VListItem>
        </VList>
        <template v-for="(tool, i) in value.tools" :key="i">
          <component :is="toolsComponents[tool]" />
        </template>
      </template>
    </AsyncState>
  </VCard>
</template>

<script lang="ts" setup>
import { useApp } from './App'

import AsyncState from '@/components/AsyncState.vue'
import { toolsComponents } from '@/components/tools'

const { state, site } = useApp()
</script>
