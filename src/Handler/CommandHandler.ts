import {Command} from '../Command'
import {Kernel} from '../Kernel'
import {OptionsProvider} from '../Options/OptionsProvider'
import {Partial} from '../Util/Partial'
import {Handler} from './Handler'

export class CommandHandler <T extends Object> implements Handler {
  constructor (
    public readonly command: Command<T>,
    public readonly defaultOptions: T,
    public readonly providers: OptionsProvider<T>[] = []
  ) {}

  async execute (kernel: Kernel): Promise<void> {
    const provisions: Partial<T>[] = await Promise.all(
      this.providers.map(p => p.provide(kernel))
    )

    const options: T = provisions
      .reduce((options: any, partial: any) => {
        return {
          ...options,
          ...partial
        }
      }, this.defaultOptions)

    await this.command.execute(options)
  }
}
