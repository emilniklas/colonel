import {Path, DirectoryPath, FilePath} from '../FileSystem/Path'
import * as path from 'path'

export interface NodePath {
  new (absolute: string, isDirectory: true): DirectoryPath
  new (absolute: string, isDirectory: false): FilePath
  new (absolute: string, isDirectory: boolean): Path
}

class NodePathClass implements Path {
  public readonly isFile: boolean

  constructor (
    public readonly absolute: string,
    public readonly isDirectory: boolean
  ) {
    this.isFile = !isDirectory
  }

  get isRoot (): boolean {
    return this.parent.absolute === this.absolute
  }

  get parent (): DirectoryPath {
    return new NodePath(
      path.dirname(this.absolute),
      true
    ) as DirectoryPath
  }

  get basename (): string {
    return path.basename(this.absolute)
  }
}

export const NodePath: NodePath = NodePathClass as any
