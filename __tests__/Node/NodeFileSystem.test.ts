import {NodeFileSystem} from '../../src/Node/NodeFileSystem'
import {NodePath} from '../../src/Node/NodePath'
import {FilePath} from '../../src/FileSystem/Path'

describe('NodeFileSystem', () => {
  const fs = new NodeFileSystem(new NodePath('/one/two/three', true), {
    readdir (path: string, callback: (err: Error | null, files: string[]) => void) {
      switch (path) {
        case '/one/two/three':
          return callback(null, ['x.true', 'y.false', 'z.true'])
        case '/one/two':
          return callback(null, ['a.false', 'b.true'])
        case '/one':
          return callback(null, [])
        case '/':
          return callback(null, ['b.true'])
        default:
          return callback(new Error(`No such directory: ${path}`), [])
      }
    },

    stat (path: string, callback: (err: Error | null, stats: {
      isFile(): boolean
      isDirectory(): boolean
    }) => any): void {
      if (path.indexOf('.') !== -1) {
        return callback(null, {
          isFile: () => true,
          isDirectory: () => false
        })
      }
      callback(null, {
        isFile: () => false,
        isDirectory: () => true
      })
    },

    readFile (
      filename: string,
      callback: (err: Error | null, data: { toString (): string }) => void
    ): void {
      callback(null, `Content of ${filename}`)
    }
  })

  it('can find all files matching the given pattern in ancestor directories', async () => {
    const paths = await fs.findUpward(/\.true$/)

    expect(paths).toEqual([
      new NodePath('/one/two/three/x.true', false),
      new NodePath('/one/two/three/z.true', false),
      new NodePath('/one/two/b.true', false),
      new NodePath('/b.true', false)
    ])
  })

  it('can find the first file matching the given pattern in ancestor directories', async () => {
    expect(
      await fs.findFirstUpward(/a\.false$/)
    ).toEqual(
      new NodePath('/one/two/a.false', false)
    )
  })

  it('can read a file', async () => {
    expect(
      await fs.readFile(
        await fs.findFirstUpward(/a\.false$/) as FilePath
      )
    ).toEqual(
      'Content of /one/two/a.false'
    )
  })
})
