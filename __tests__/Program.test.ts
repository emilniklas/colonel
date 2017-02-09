import {Program} from '../src/Program'
import {Kernel} from '../src/Kernel'

describe('Program', () => {
  it('passes its kernel into a command handler', async () => {
    let other: Kernel | undefined

    const program = new Program({
      async execute (kernel: Kernel) {
        other = kernel
      }
    })

    const kernel = {}

    await program.execute(kernel)

    expect(other).toBe(kernel)
  })
})
