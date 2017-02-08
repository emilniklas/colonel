import {FormatParser} from './FormatParser'
import {parse} from 'yamljs'

export class YamlFormatParser implements FormatParser {
  parse (yaml: string): any {
    return parse(yaml)
  }
}
