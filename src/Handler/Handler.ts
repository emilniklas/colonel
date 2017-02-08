import {Program} from '../Program'

export interface Handler {
  execute (program: Program): Promise<void>
}
