import {Flags} from './Flags'
import {ArgvStream} from './ArgvStream'

export interface ArgvParser <T> {
  readonly flags?: Flags<T>
  readonly positions?: (keyof T)[]
  option (stream: ArgvStream, option: keyof T): T[typeof option]
}
