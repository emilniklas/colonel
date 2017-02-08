import {Program} from '../../src/Program'
import {Kernel} from '../../src/Kernel'
import {ArgvParser} from '../../src/Argv/ArgvParser'
import {ArgvStream} from '../../src/Argv/ArgvStream'
import {ArgvOptionsProvider} from '../../src/Argv/ArgvOptionsProvider'

describe('ArgvOptionsProvider', () => {
  it('parses a list of arguments into an options object', async () => {
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
})
