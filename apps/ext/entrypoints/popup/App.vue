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
    <AsyncState :state="activeTab">
      <template v-slot="{ value }">
        <VList>
          <VListItem :title="value.title" :subtitle="value.url" :prepend-avatar="value.favIconUrl">
            <template #append>
              <VChip v-bind="site" />
            </template>
          </VListItem>
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
