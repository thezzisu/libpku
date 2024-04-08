import { useAsyncState } from '@vueuse/core'
import { ComputedRef, InjectionKey, computed, inject, provide } from 'vue'

const key: InjectionKey<
  ComputedRef<{
    tabId: number
    url: string
  }>
> = Symbol('popup_app')

const knownSites: Record<string, string> = {
  'course.pku.edu.cn': '北大教学网',
  'its.pku.edu.cn': '北大网络服务',
  'treehole.pku.edu.cn': '北大树洞',
  'portal.pku.edu.cn': '北大信息门户'
}

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
    const hostname = url && new URL(url).hostname
    if (!hostname || !hostname.match(/^([^.]+\.)*pku\.edu\.cn$/)) return ''
    if (hostname in knownSites) return knownSites[hostname]
    return '北大网站群'
  })
  return { activeTab, site }
}

export function useAppCtx() {
  return inject(key)!
}
