import { useAsyncState } from '@vueuse/core'
import { computed } from 'vue'

import { getEnabledTools } from '@/tools'

export function useApp() {
  const state = useAsyncState(async () => {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true })
    const tools = tab?.url ? await getEnabledTools({ url: tab.url }) : []
    return { tab, tools }
  }, null)

  const site = computed(() => {
    const url = state.state.value?.tab.url
    const { trusted, name, color } = getUrlInfo(url)
    return {
      prependIcon: trusted ? 'mdi-check-decagram' : '',
      text: name,
      color
    }
  })
  return { state, site }
}
