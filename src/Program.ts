import {Handler} from './Handler/Handler'

export class Program {
  constructor (
    private _handler: Handler
  ) {}

  async execute (argv: string[]): Promise<void> {
    await this._handler.execute(this)
  }
}
