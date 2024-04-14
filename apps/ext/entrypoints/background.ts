import { getEnabledTools } from '@/tools'

export default defineBackground(() => {
  function updatePopup(url?: string) {
    if (url) {
      getEnabledTools({ url }).then(({ length }) =>
        browser.action.setBadgeText({
          text: length ? `${length}` : null
        })
      )
    }
    const { trusted } = getUrlInfo(url)
    if (trusted) {
      browser.action.setIcon({
        path: {
          '16': 'icon/16.png',
          '32': 'icon/32.png',
          '48': 'icon/48.png',
          '96': 'icon/96.png',
          '128': 'icon/128.png'
        }
      })
    } else {
      browser.action.setIcon({
        path: {
          '16': 'icon/16.gray.png',
          '32': 'icon/32.gray.png',
          '48': 'icon/48.gray.png',
          '96': 'icon/96.gray.png',
          '128': 'icon/128.gray.png'
        }
      })
    }
  }

  browser.tabs.onActivated.addListener(async ({ tabId }) => {
    const tab = await browser.tabs.get(tabId)
    updatePopup(tab.url)
  })
  browser.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    changeInfo.url && updatePopup(changeInfo.url)
  })
  browser.runtime.onInstalled.addListener(() => {
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then(([tab]) => tab && updatePopup(tab.url))
  })
})
