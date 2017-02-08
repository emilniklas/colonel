import {JsonFormatParser} from '../../src/FileOptions/JsonFormatParser'

describe('JsonFormatParser', () => {
  const parser = new JsonFormatParser()

  it('parses JSON', () => {
    const res = parser.parse('{"option":"value"}')

    expect(res).toEqual({
      option: 'value'
    })
  })
})
