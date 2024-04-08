import { defineExtensionMessaging } from '@webext-core/messaging'

interface ProtocolMap {
  'course:get-video-urls'(data: unknown): {
    token: string
    videos: { title: string; subTitle: string; url: string }[]
  }

  'disk:get-download-url'(data: { gns: string }): { path: string; url: string }
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>()
