import {FileSystem} from './FileSystem/FileSystem'

export interface Kernel {
  readonly argv?: string[]
  readonly filesystem?: FileSystem
}
