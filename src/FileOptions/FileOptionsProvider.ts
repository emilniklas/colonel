import {Validator} from './Validator'
import {FormatParser} from './FormatParser'
import {OptionsProvider} from '../Options/OptionsProvider'
import {Path, FilePath} from '../FileSystem/Path'
import {Kernel} from '../Kernel'
import {Partial} from '../Util/Partial'

export class FileOptionsProvider <T> implements OptionsProvider<T> {
  constructor (
    public readonly pattern: RegExp | string,
    public readonly parser: FormatParser,
    public readonly validator: Validator<T>
  ) {}

  async provide ({ filesystem }: Kernel): Promise<Partial<T>> {
    if (filesystem == null) {
      return {} as any
    }

    const path = await filesystem.findFirstUpward(this.pattern)

    if (path == null || !(this._isFile(path))) {
      return {} as any
    }

    const encoded = await filesystem.readFile(path)
    const decoded = this.parser.parse(encoded)
    const validated = this.validator.validate(decoded)

    return validated
  }

  _isFile (path: Path): path is FilePath {
    return path.isFile
  }
}
