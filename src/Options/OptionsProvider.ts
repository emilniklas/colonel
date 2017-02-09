import {Kernel} from '../Kernel'
import {Partial} from '../Util/Partial'

export interface OptionsProvider <T> {
  provide (kernel: Kernel): Promise<Partial<T>>
}
