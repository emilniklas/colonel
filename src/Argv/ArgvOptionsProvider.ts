import {Kernel} from '../Kernel'
import {ArgvParser} from './ArgvParser'
import {ArgvStream} from './ArgvStream'
import {OptionsProvider} from '../Options/OptionsProvider'
import {Partial} from '../Util/Partial'

export class ArgvOptionsProvider <T> implements OptionsProvider<T> {
  constructor (
    public readonly parser: ArgvParser<T>
  ) {}

  async provide (kernel: Kernel): Promise<Partial<T>> {
    const stream = new ArgvStream(kernel.argv || [])
    const lookup = this._lookup()

    let options: Partial<T> = {} as any
    let positionalIndex = -1

    const addOption = (option: keyof T) =>
      options[option] = this.parser.option(stream, option)

    while (!stream.isEmpty) {
      const flag = stream.next()

      if (flag in lookup) {
        addOption(lookup[flag])
        continue
      }

      if (this.parser.positions == null) {
        throw new Error(`Unrecognized flag: ${flag}`)
      }

      stream.previous()
      positionalIndex++

      if (this._acceptsPositional(positionalIndex)) {
        addOption(this.parser.positions[positionalIndex])
        continue
      }

      throw new Error(`Too many arguments`)
    }

    return options
  }

  private _acceptsPositional (index: number): boolean {
    return this.parser.positions != null &&
      index < this.parser.positions.length
  }

  private _lookup (): { [flag: string]: keyof T } {
    const { flags: names } = this.parser

    if (names == null) {
      return {}
    }

    return Object.keys(names)
      .reduce((lookup, name: keyof T) => {
        const flags = names[name]
        const newLookups = flags
          .reduce((l: any, flag: string) => ({
            ...l,
            [flag]: name
          }), {})
        return {
          ...lookup,
          ...newLookups
        }
      }, {})
  }
}
