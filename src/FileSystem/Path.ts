export interface Path {
  readonly absolute: string
  readonly isRoot: boolean
  readonly parent: DirectoryPath

  readonly isDirectory: boolean
  readonly isFile: boolean
}

export interface DirectoryPath extends Path {
  readonly isDirectory: true
  readonly isFile: false
}

export interface FilePath extends Path {
  readonly isDirectory: false
  readonly isFile: true
}
