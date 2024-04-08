import { useAsyncState } from '@vueuse/core'
import { ComputedRef, InjectionKey, computed, inject, provide } from 'vue'

const key: InjectionKey<
  ComputedRef<{
    tabId: number
    url: string
  }>
> = Symbol('popup_app')

export function useApp() {
  const activeTab = useAsyncState(async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    return tabs[0]
  }, null)
  provide(
    key,
    computed(() => ({
      tabId: activeTab.state.value?.id || 0,
      url: activeTab.state.value?.url || ''
    }))
  )
  const site = computed(() => {
    const url = activeTab.state.value?.url
    const { trusted, name, color } = getUrlInfo(url)
    return {
      prependIcon: trusted ? 'mdi-check-decagram' : '',
      text: name,
      color
    }
  })
  return { activeTab, site }
}

export function useAppCtx() {
  return inject(key)!
}
