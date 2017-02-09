import {FileSystem} from '../FileSystem/FileSystem'
import {Path, DirectoryPath, FilePath} from '../FileSystem/Path'
import {NodePath} from './NodePath'
import * as fs from 'fs'
import * as path from 'path'

export interface NativeFileSystem {
  readdir (path: string, callback: (err: Error | null, files: string[]) => void): void
  stat (path: string, callback: (err: Error | null, stats: {
    isFile(): boolean
    isDirectory(): boolean
  }) => any): void
  readFile (
    filename: string,
    callback: (err: Error | null, data: { toString (): string }) => void
  ): void
}

export interface NativePath {
  resolve(...pathSegments: any[]): string
}

export class NodeFileSystem implements FileSystem {
  constructor (
    public readonly cwd: DirectoryPath,
    private readonly _fs: NativeFileSystem = fs,
    private readonly _path: NativePath = path
  ) {
    this._createPath = this._createPath.bind(this)
  }

  list (directory: DirectoryPath): Promise<Path[]> {
    return new Promise((resolve, reject) => {
      this._fs.readdir(directory.absolute, (err, files) => {
        if (err != null) {
          reject(err)
        } else {
          resolve(
            Promise.all(
              files
                .map(p => this._path.resolve(directory.absolute, p))
                .map(this._createPath)
            )
          )
        }
      })
    })
  }

  findUpward (pattern: RegExp | string): Promise<Path[]> {
    const regex = typeof pattern === 'string'
      ? new RegExp(`^${pattern}$`)
      : pattern

    return this._findUpward([], this.cwd, regex)
  }

  async findFirstUpward (pattern: RegExp | string): Promise<Path | null> {
    const regex = typeof pattern === 'string'
      ? new RegExp(`^${pattern}$`)
      : pattern

    const matches = await this._findUpward([], this.cwd, regex, f => f.length > 0)

    return matches[0] || null
  }

  readFile (path: FilePath): Promise<string> {
    return new Promise((resolve, reject) => {
      this._fs.readFile(path.absolute, (err, buffer) => {
        if (err != null) {
          reject(err)
        } else {
          resolve(buffer.toString())
        }
      })
    })
  }

  private _createPath (absolute: string): Promise<Path> {
    return new Promise((resolve, reject) => {
      this._fs.stat(absolute, (err, stat) => {
        if (err != null) {
          reject(err)
        } else {
          resolve(new NodePath(absolute, stat.isDirectory()))
        }
      })
    })
  }

  async _findUpward (
    carry: Path[],
    dir: DirectoryPath,
    pattern: RegExp,
    shouldCancel: (found: Path[]) => boolean = () => false
  ): Promise<Path[]> {
    const paths = await this.list(dir)

    let out = carry.concat(
        paths.reduce(
          (matching, path) => {
            if (pattern.test(path.basename)) {
              return matching.concat(path)
            }
            return matching
          },
          [] as Path[]
      )
    )

    if (dir.isRoot || shouldCancel(out)) {
      return out
    }

    return this._findUpward(out, dir.parent, pattern)
  }
}
