import {CommandHandler} from '../../src/Handler/CommandHandler'
import {Command} from '../../src/Command'
import {Program} from '../../src/Program'
import {DefaultsOptionsProvider} from '../../src/Options/DefaultsOptionsProvider'

describe('CommandHandler', () => {
  it('runs a command', async () => {
    let called = false

    class XCommand implements Command<{}> {
      execute () {
        called = true
      }
    }

    const handler = new CommandHandler<{}>(new XCommand())
    const program = new Program(handler)

    await handler.execute(program)

    expect(called).toBeTruthy()
  })

  it('uses an options provider to fill options', async () => {
    let result = ''

    interface Opt {
      field: string
    }

    class XCommand implements Command<Opt> {
      execute ({ field }: Opt) {
        result = field
      }
    }

    const handler = new CommandHandler<Opt>(
      new XCommand(),
      [
        new DefaultsOptionsProvider<Opt>({
          field: 'abc'
        })
      ]
    )
    const program = new Program(handler)

    await handler.execute(program)

    expect(result).toBe('abc')
  })
})
