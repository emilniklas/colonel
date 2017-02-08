import {OptionsProvider} from './OptionsProvider'

export class DefaultsOptionsProvider <T> implements OptionsProvider <T> {
  constructor (
    public readonly options: T
  ) {}

  async provide (): Promise<T> {
    return this.options
  }
}
