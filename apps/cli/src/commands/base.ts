import { Cli, Command } from 'clipanion'
import { consola } from 'consola'

export const cli = new Cli({
  binaryLabel: `LibPKU Cli`,
  binaryName: `pku`
})

export abstract class BaseCommand extends Command {
  async catch(error: unknown) {
    consola.error(error)
  }
}
