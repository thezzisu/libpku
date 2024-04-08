<template>
  <VCardSubtitle>下载GNS标识</VCardSubtitle>
  <VCardText>
    <VTextField label="GNS" v-model="gns" />
  </VCardText>
  <VCardActions>
    <VBtn :loading="loading" :disabled="!gns" @click="getLink">获取下载链接</VBtn>
  </VCardActions>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const gns = ref('')
const loading = ref(false)

async function getLink() {
  const granted = await browser.permissions.request({
    origins: ['*://disk.pku.edu.cn/*'],
    permissions: ['cookies']
  })
  if (!granted) throw new Error('未授权')
  const cookie = await browser.cookies.get({
    url: 'https://disk.pku.edu.cn',
    name: 'client.oauth2_token'
  })
  if (!cookie) throw new Error('未找到 Cookie')
  const token = decodeURIComponent(cookie.value)
  const { namepath } = await fetch('https://disk.pku.edu.cn/api/efast/v1/file/convertpath', {
    headers: { authorization: `Bearer ${token}` },
    referrer: 'https://disk.pku.edu.cn/',
    body: JSON.stringify({ docid: gns.value }),
    method: 'POST'
  }).then((r) => r.json())
  const savename = namepath.split('/').pop() ?? 'out'
  const body = {
    docid: gns.value,
    authtype: 'QUERY_STRING',
    savename: savename,
    usehttps: true,
    rev: ''
  }
  const { authrequest } = await fetch('https://disk.pku.edu.cn/api/efast/v1/file/osdownload', {
    headers: { authorization: `Bearer ${token}` },
    referrer: 'https://disk.pku.edu.cn/',
    body: JSON.stringify(body),
    method: 'POST'
  }).then((r) => r.json())
  const url = authrequest[1]
  navigator.clipboard
    .writeText(url)
    .then(() => alert('已复制到剪贴板'))
    .catch(() => alert('复制失败'))
}
</script>
