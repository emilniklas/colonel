import {Kernel} from '../Kernel'

export interface Handler {
  execute (kernel: Kernel): Promise<void>
}
