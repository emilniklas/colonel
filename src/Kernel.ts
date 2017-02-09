import {FileSystem} from './FileSystem/FileSystem'
import {Path} from './FileSystem/Path'

export interface Kernel {
  readonly argv?: string[]
  readonly cwd?: Path
  readonly filesystem?: FileSystem
}
