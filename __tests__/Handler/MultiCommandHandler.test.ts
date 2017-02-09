import {MultiCommandHandler} from '../../src/Handler/MultiCommandHandler'
import {ArgvOptionsProvider} from '../../src/Argv/ArgvOptionsProvider'
import {CommandHandler} from '../../src/Handler/CommandHandler'

describe('MultiCommandHandler', () => {
  interface Opts {
    field: string
  }

  it('can execute a command by name', async () => {
    let result = ''

    const handler = new MultiCommandHandler({
      'command': new CommandHandler<Opts>({
        execute ({ field }: Opts) {
          result = field
        }
      }, {
        field: 'default'
      })
    })

    await handler.execute({
      argv: ['command']
    })

    expect(result).toBe('default')
  })

  it('can execute a default command', async () => {
    let result = ''

    const handler = new MultiCommandHandler({
      'command': new CommandHandler<Opts>({
        execute ({ field }: Opts) {
          result = field
        }
      }, {
        field: 'default'
      })
    }, {
      defaultCommand: 'command'
    })

    await handler.execute({
      argv: []
    })

    expect(result).toBe('default')
  })

  it('throws if no command matches', async () => {
    const handler = new MultiCommandHandler({})

    try {
      await handler.execute({
        argv: ['invalid-command']
      })
    } catch (e) {
      return
    }

    throw new Error("Didn't throw")
  })

  it('throws if there is no default command', async () => {
    const handler = new MultiCommandHandler({})

    try {
      await handler.execute({
        argv: []
      })
    } catch (e) {
      return
    }

    throw new Error("Didn't throw")
  })

  it('can execute a default command', async () => {
    let result = ''

    const handler = new MultiCommandHandler({
      'command': new CommandHandler<Opts>({
        execute ({ field }: Opts) {
          result = field
        }
      }, {
        field: 'default'
      })
    }, {
      defaultCommand: 'command'
    })

    await handler.execute({
      argv: []
    })

    expect(result).toBe('default')
  })

  it('slices the argv', async () => {
    let result = ''

    const handler = new MultiCommandHandler({
      'command': new CommandHandler<Opts>({
        execute ({ field }: Opts) {
          result = field
        }
      }, {
        field: 'default'
      }, [
        new ArgvOptionsProvider<Opts>({
          flags: { field: ['--field'] },
          option (stream) {
            return stream.next()
          }
        })
      ])
    })

    await handler.execute({
      argv: ['command', '--field', 'res']
    })

    expect(result).toBe('res')
  })

  it("doesn't slice the argv for the default command", async () => {
    let result = ''

    const handler = new MultiCommandHandler({
      'command': new CommandHandler<Opts>({
        execute ({ field }: Opts) {
          result = field
        }
      }, {
        field: 'default'
      }, [
        new ArgvOptionsProvider<Opts>({
          flags: { field: ['--field'] },
          option (stream) {
            return stream.next()
          }
        })
      ])
    }, {
      defaultCommand: 'command'
    })

    await handler.execute({
      argv: ['--field', 'res']
    })

    expect(result).toBe('res')
  })
})
