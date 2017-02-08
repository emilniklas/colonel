import {FileOptionsProvider} from '../../src/FileOptions/FileOptionsProvider'
import {Validator} from '../../src/FileOptions/Validator'
import {JsonFormatParser} from '../../src/FileOptions/JsonFormatParser'

describe('FileOptionsProvider', () => {
  it('reads options from a file', async () => {
    interface Opts {
      option: string
    }

    class OptsValidator implements Validator<Opts> {
      validate (input: any): Opts {
        return {
          option: input.option
        }
      }
    }

    const provider = new FileOptionsProvider<Opts>(
      /testfile$/,
      new JsonFormatParser(),
      new OptsValidator()
    )

    const testfile = '{"option":"value"}'

    const opts = await provider.provide({
      filesystem: {
        async findFirstUpward (pat: string | RegExp) {
          expect(pat).toEqual(/testfile$/)
          return 'testfile'
        },
        async readFile (path: any) {
          expect(path).toEqual('testfile')
          return testfile
        }
      } as any
    })

    expect(opts).toEqual({
      option: 'value'
    })
  })
})
