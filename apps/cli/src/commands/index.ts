import { readFile } from 'node:fs/promises'

import { Option } from 'clipanion'
import { isArray, isString } from 'typanion'

import { BaseCommand, cli } from './base.js'

export class BatchCommand extends BaseCommand {
  static paths = [['batch']]

  static usage = this.Usage({
    description: `Batch process requests`
  })

  private static isRequest = isArray(isString())

  requests = Option.Rest({ required: 1 })

  async execute() {
    for (const file of this.requests) {
      const content = await readFile(file, 'utf-8')
      const lines = content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.trim().startsWith('['))
        .map((line) => JSON.parse(line))
      for (const line of lines) {
        if (!BatchCommand.isRequest(line)) {
          throw new Error(`Invalid request: ${JSON.stringify(line)}`)
        }
        await this.cli.run(line)
      }
    }
  }
}

cli.register(BatchCommand)

export * from './base.js'
export * from './course.js'
