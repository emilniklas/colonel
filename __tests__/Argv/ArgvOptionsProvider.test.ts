import {Program} from '../../src/Program'
import {Kernel} from '../../src/Kernel'
import {ArgvParser} from '../../src/Argv/ArgvParser'
import {ArgvStream} from '../../src/Argv/ArgvStream'
import {ArgvOptionsProvider} from '../../src/Argv/ArgvOptionsProvider'

describe('ArgvOptionsProvider', () => {
  it('parses flags of options into an options object', async () => {
    interface Opts {
      field: string
    }

    class OptsArgvParser implements ArgvParser<Opts> {
      readonly flags = {
        field: ['--field']
      }

      option (stream: ArgvStream, flag: keyof Opts): Opts[typeof flag] {
        switch (flag) {
          case 'field':
            return stream.next()
        }
      }
    }

    const provider = new ArgvOptionsProvider<Opts>(
      new OptsArgvParser()
    )

    let result: Partial<Opts> | undefined

    const program = new Program({
      async execute (kernel: Kernel) {
        result = await provider.provide(kernel)
      }
    })

    await program.execute({
      argv: ['--field', 'value']
    })

    expect(result).toEqual({
      field: 'value'
    })
  })

  it('parses a list of arguments into an options object', async () => {
    interface Opts {
      field: string
    }

    class OptsArgvParser implements ArgvParser<Opts> {
      positions: (keyof Opts)[] = ['field']

      option (stream: ArgvStream, option: keyof Opts) {
        return stream.next()
      }
    }

    const provider = new ArgvOptionsProvider<Opts>(
      new OptsArgvParser()
    )

    let result: Partial<Opts> | undefined

    const program = new Program({
      async execute (kernel: Kernel) {
        result = await provider.provide(kernel)
      }
    })

    await program.execute({
      argv: ['value']
    })

    expect(result).toEqual({
      field: 'value'
    })
  })

  it('combines options and arguments', async () => {
    interface Opts {
      option: string
      argument: string
    }

    class OptsArgvParser implements ArgvParser<Opts> {
      flags = { option: ['--option'] }
      positions: (keyof Opts)[] = ['argument']

      option (stream: ArgvStream, option: keyof Opts) {
        return stream.next()
      }
    }

    const provider = new ArgvOptionsProvider<Opts>(
      new OptsArgvParser()
    )

    let result: Partial<Opts> | undefined

    const program = new Program({
      async execute (kernel: Kernel) {
        result = await provider.provide(kernel)
      }
    })

    await program.execute({
      argv: ['--option', 'option', 'argument']
    })

    expect(result).toEqual({
      option: 'option',
      argument: 'argument'
    })

    await program.execute({
      argv: ['argument2', '--option', 'option2']
    })

    expect(result).toEqual({
      option: 'option2',
      argument: 'argument2'
    })
  })
})
