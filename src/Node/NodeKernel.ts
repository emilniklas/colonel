import {Kernel} from '../Kernel'

export class NodeKernel implements Kernel {
  readonly argv = process.argv.slice(2)
}
