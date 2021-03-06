import {Kernel} from '../Kernel'
import {NodeFileSystem} from './NodeFileSystem'
import {NodePath} from './NodePath'
import {DirectoryPath} from '../FileSystem/Path'

const cwd: DirectoryPath = new NodePath(process.cwd(), true)

export class NodeKernel implements Kernel {
  readonly argv = process.argv.slice(2)
  readonly cwd = cwd
  readonly filesystem = new NodeFileSystem(cwd)
}
