export type Flags <T> = {
  [P in keyof T]?: string[]
}
