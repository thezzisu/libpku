const knownSites: Record<string, string> = {
  'course.pku.edu.cn': '北大教学网',
  'its.pku.edu.cn': '北大网络服务',
  'treehole.pku.edu.cn': '北大树洞',
  'portal.pku.edu.cn': '北大信息门户',
  'disk.pku.edu.cn': '北大网盘'
}

export function getUrlInfo(url?: string) {
  if (!url) {
    return {
      trusted: false,
      name: '未知网站',
      color: 'error'
    }
  }
  const { hostname } = new URL(url)
  if (!hostname || !hostname.match(/^([^.]+\.)*pku\.edu\.cn$/)) {
    const extId = browser.runtime.id
    if (hostname === extId) {
      return {
        trusted: true,
        name: 'LibPKU页面',
        color: 'primary'
      }
    }
    return {
      trusted: false,
      name: '非北大网站',
      color: 'warning'
    }
  }
  return {
    trusted: true,
    name: knownSites[hostname] || '北大网站群',
    color: 'success'
  }
}
