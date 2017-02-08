import {Flags} from './Flags'
import {ArgvStream} from './ArgvStream'

export interface ArgvParser <T> {
  readonly flags: Flags<T>
  option (stream: ArgvStream, flag: keyof T): T[typeof flag]
}
