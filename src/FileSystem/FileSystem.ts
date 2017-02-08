import {Path} from './Path'

export interface FileSystem {
  findUpward (pattern: RegExp | string): Promise<Path[]>
  findFirstUpward (pattern: RegExp | string): Promise<Path | null>
  readFile (path: Path): Promise<string>
}
