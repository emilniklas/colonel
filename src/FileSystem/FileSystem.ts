import {Path, DirectoryPath, FilePath} from './Path'

export interface FileSystem {
  cwd: DirectoryPath
  list (directory: DirectoryPath): Promise<Path[]>
  findUpward (pattern: RegExp | string): Promise<Path[]>
  findFirstUpward (pattern: RegExp | string): Promise<Path | null>
  readFile (path: FilePath): Promise<string>
}
