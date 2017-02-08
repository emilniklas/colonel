import {FormatParser} from './FormatParser'

export class JsonFormatParser implements FormatParser {
  parse (json: string): any {
    return JSON.parse(json)
  }
}
