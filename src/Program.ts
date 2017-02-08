import {Handler} from './Handler/Handler'
import {Kernel} from './Kernel'
import {NodeKernel} from './Node/NodeKernel'

export class Program {
  constructor (
    private _handler: Handler
  ) {}

  async execute (kernel: Kernel = new NodeKernel()): Promise<void> {
    await this._handler.execute(kernel)
  }
}
