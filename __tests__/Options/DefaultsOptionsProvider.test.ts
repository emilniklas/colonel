import {DefaultsOptionsProvider} from '../../src/Options/DefaultsOptionsProvider'
import {OptionsProvider} from '../../src/Options/OptionsProvider'

describe('DefaultsOptionsProvider', () => {
  interface X {
    a: string
    b: number
  }

  const x = {
    a: 'x',
    b: 1
  }

  const provider = new DefaultsOptionsProvider<X>(x)

  it('contains options', () => {
    expect(provider.options).toBe(x)
  })

  it('satisfies the OptionsProvider interface', async () => {
    const p: OptionsProvider<X> = provider

    expect(await p.provide({})).toBe(x)
  })
})
