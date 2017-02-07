import {Program} from '../Program'
import {Partial} from '../Util/Partial'

export interface OptionsProvider <T> {
  provide (program: Program): Promise<Partial<T>>
}
