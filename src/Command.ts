import {Awaitable} from './Util/Awaitable'

export interface Command <T extends Object> {
  execute (options: T): Awaitable<void>
}
