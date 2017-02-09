import {Partial} from '../Util/Partial'

export interface Validator <T> {
  validate (input: any): Partial<T>
}
