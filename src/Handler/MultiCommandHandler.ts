import {Handler} from './Handler'
import {Kernel} from '../Kernel'

export namespace MultiCommandHandler {
  export interface Options {
    defaultCommand?: string
  }
}

export class MultiCommandHandler implements Handler {
  constructor (
    public readonly commands: {
      [command: string]: Handler
    },
    private readonly _options: MultiCommandHandler.Options = {}
  ) {}

  async execute (kernel: Kernel): Promise<void> {
    const { argv } = kernel

    if (argv == null) {
      throw new Error('No argument list was provided')
    }

    const requestedCommand = argv[0]
    const innerKernel: Kernel = Object.assign({}, kernel, {
      argv: argv.slice(1)
    })

    for (const command in this.commands) {
      if (requestedCommand === command) {
        return this.commands[command].execute(innerKernel)
      }
    }

    const defaultCommand = this._options.defaultCommand

    if (typeof defaultCommand === 'string') {
      return this.commands[defaultCommand].execute(kernel)
    }

    throw new Error(`No such command [${requestedCommand}]`)
  }
}
