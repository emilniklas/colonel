import {YamlFormatParser} from '../../src/FileOptions/YamlFormatParser'

describe('YamlFormatParser', () => {
  const parser = new YamlFormatParser()

  it('parses YAML', () => {
    const res = parser.parse('option: value')

    expect(res).toEqual({
      option: 'value'
    })
  })
})
