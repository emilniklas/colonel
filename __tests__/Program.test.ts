import {Program} from '../src/Program'

describe('Program', () => {
  it('passes itself into a command handler', async () => {
    let other: Program | undefined
    const program = new Program({
      async execute (program: Program) {
        other = program
      }
    })

    await program.execute()

    expect(other).toBe(program)
  })
})
