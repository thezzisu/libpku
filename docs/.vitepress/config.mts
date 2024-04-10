import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'LibPKU',
  description: '自由的北大API与实用程序',
  themeConfig: {
    logo: '/icon.svg',

    nav: [
      { text: '首页', link: '/' },
      { text: '命令行', link: '/cli/' },
      { text: '浏览器扩展', link: '/ext/' }
    ],

    sidebar: [
      {
        text: '命令行',
        items: [{ text: '使用说明', link: '/cli/' }]
      },
      {
        text: '浏览器扩展',
        items: [{ text: '使用说明', link: '/ext/' }]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/thezzisu/libpku' }]
  }
})
