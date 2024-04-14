import { spawn } from 'child_process'
import path from 'node:path'

import { cancel, isCancel, multiselect, text } from '@clack/prompts'
import { Option } from 'clipanion'
import { consola } from 'consola'
import * as fs from 'fs-extra'
import terminalLink from 'terminal-link'
import { isArray, isObject, isString } from 'typanion'
import which from 'which'

import { BaseCommand, cli } from './base.js'

export class CourseVideoDownloadCommand extends BaseCommand {
  static paths = [[`course`, `video`]]

  static usage = this.Usage({
    category: 'Course',
    description: `Start ${terminalLink('course.pku.edu.cn', 'https://course.pku.edu.cn')} video downloader`
  })

  private static isDownloadData = isObject({
    token: isString(),
    videos: isArray(
      isObject({
        title: isString(),
        subTitle: isString(),
        url: isString()
      })
    )
  })

  output = Option.String('-o,--output', { required: false })
  ffmpeg = Option.String('--ffmpeg', { required: false })
  m3u8dl = Option.String('--m3u8dl', { required: false })
  curl = Option.String('--curl', { required: false })
  info = Option.String({ required: true })

  cancel<T>(value: T | symbol): asserts value is T {
    if (isCancel(value)) {
      cancel()
      process.exit(0)
    }
  }

  async getFfmpegPath() {
    if (this.ffmpeg && (await fs.pathExists(this.ffmpeg))) return this.ffmpeg
    const path = await which('ffmpeg', { nothrow: true })
    if (path) return path
    for (;;) {
      const value = await text({
        message: 'Please enter the path to ffmpeg'
      })
      this.cancel(value)
      if (await fs.pathExists(value)) return value
      consola.error(`File not found: ${value}`)
    }
  }

  async getM3u8DlPath() {
    if (this.m3u8dl && (await fs.pathExists(this.m3u8dl))) return this.m3u8dl
    const path = await which('N_m3u8DL-RE', { nothrow: true })
    if (path) return path
    for (;;) {
      const value = await text({
        message: `Please enter the path to ${terminalLink('N_m3u8DL-RE', 'https://github.com/nilaoda/N_m3u8DL-RE')}. Leave empty to use ffmpeg (slow!)`
      })
      this.cancel(value)
      if (!value) return null
      if (await fs.pathExists(value)) return value
      consola.error(`File not found: ${value}`)
    }
  }

  async getCurlPath() {
    if (this.curl && (await fs.pathExists(this.curl))) return this.curl
    const path = await which('curl', { nothrow: true })
    if (path) return path
    for (;;) {
      const value = await text({
        message: 'Please enter the path to curl'
      })
      this.cancel(value)
      if (await fs.pathExists(value)) return value
      consola.error(`File not found: ${value}`)
    }
  }

  async execute() {
    const data = JSON.parse(Buffer.from(this.info, 'base64').toString('utf-8'))
    if (!CourseVideoDownloadCommand.isDownloadData(data)) {
      throw new Error(`Invalid download data: ${this.info}`)
    }
    const { token, videos } = data
    const cookieHeader = `Cookie: _token=${encodeURIComponent(token)}`

    const selection = await multiselect({
      message: 'Select videos to download',
      options: videos.map(({ title, subTitle, url }, index) => ({
        label: `${title} ${subTitle}`,
        value: index,
        hint: url
      })),
      initialValues: videos.map((_, index) => index)
    })
    this.cancel(selection)
    const hasM3u8 = videos.some(({ url }) => path.extname(new URL(url).pathname) === '.m3u8')
    const hasMp4 = videos.some(({ url }) => path.extname(new URL(url).pathname) === '.mp4')
    const ffmpeg = hasM3u8 ? await this.getFfmpegPath() : ''
    const m3u8dl = hasM3u8 ? await this.getM3u8DlPath() : ''
    const curl = hasMp4 ? await this.getCurlPath() : ''

    const base = path.resolve(this.output ?? '.')
    for (const index of selection) {
      const { title, subTitle, url } = videos[index]
      const dir = path.join(base, title)
      await fs.ensureDir(dir)

      const dstname = path.join(dir, `${subTitle}.mp4`)
      const extname = path.extname(new URL(url).pathname)
      consola.info(`Downloading ${title} ${subTitle} to ${dstname}`)

      switch (extname) {
        case '.m3u8':
          if (m3u8dl) {
            const filename = `${subTitle}`
            await this.exec(m3u8dl, [
              url,
              '--save-dir',
              dir,
              '--save-name',
              filename,
              '--ffmpeg-binary-path',
              ffmpeg,
              '-H',
              cookieHeader,
              '-M',
              'format=mp4'
            ])
          } else {
            await this.exec(ffmpeg, [
              '-headers',
              cookieHeader,
              '-i',
              url,
              '-codec',
              'copy',
              '-v',
              'quiet',
              '-stats',
              dstname
            ])
          }
          break
        case '.mp4':
          await this.exec(curl, ['-H', cookieHeader, '-o', dstname, url])
          break
        default:
          consola.error(`Unsupported video format: ${extname}`)
      }
    }
  }

  async exec(cmd: string, args: string[]) {
    const process = spawn(cmd, args, { stdio: 'inherit' })
    return new Promise<void>((resolve, reject) => {
      process.on('exit', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`${cmd} exited with code ${code}`))
        }
      })
      process.on('error', reject)
    })
  }
}

cli.register(CourseVideoDownloadCommand)
