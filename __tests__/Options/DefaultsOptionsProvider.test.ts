import {DefaultsOptionsProvider} from '../../src/Options/DefaultsOptionsProvider'
import {OptionsProvider} from '../../src/Options/OptionsProvider'
import {Program} from '../../src/Program'

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
    const program: Program = {}
    const p: OptionsProvider<X> = provider

    expect(await p.provide(program)).toBe(x)
  })
})
