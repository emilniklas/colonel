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

    while (!stream.isEmpty) {
      const flag = stream.next()

      if (!(flag in lookup)) {
        throw new Error(`Unrecognized flag: ${flag}`)
      }

      const prop = lookup[flag]

      options[prop] = this.parser.option(stream, prop)
    }

    return options
  }

  private _lookup (): { [flag: string]: keyof T } {
    return Object.keys(this.parser.flags)
      .reduce((lookup, name: keyof T) => {
        const flags = this.parser.flags[name]
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
