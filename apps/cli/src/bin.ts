#!/usr/bin/env node

import { cli } from './commands/index.js'

const [, , ...args] = process.argv
cli.runExit(args)
