import {Command} from '../Command'
import {Program} from '../Program'
import {OptionsProvider} from '../Options/OptionsProvider'
import {Partial} from '../Util/Partial'
import {Handler} from './Handler'

export class CommandHandler <T extends Object> implements Handler {
  constructor (
    public readonly command: Command<T>,
    public readonly providers: OptionsProvider<T>[] = []
  ) {}

  async execute (program: Program): Promise<void> {
    const provisions: Partial<T>[] = await Promise.all(
      this.providers.map(p => p.provide(program))
    )

    const options: T = provisions
      .reduce((options: any, partial: any) => {
        return {
          ...options,
          ...partial
        }
      }, {} as any)

    await this.command.execute(options)
  }
}
