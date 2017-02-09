import {ArgvStream} from '../../src/Argv/ArgvStream'

describe('ArgvStream', () => {
  it('holds a list of arguments', () => {
    const stream = new ArgvStream(['a', 'b', 'c'])

    expect(stream.isEmpty).toBeFalsy()

    expect(stream.next()).toBe('a')
    expect(stream.next()).toBe('b')
    expect(stream.next()).toBe('c')

    expect(stream.isEmpty).toBeTruthy()

    expect(() => stream.next()).toThrow()
  })
})
