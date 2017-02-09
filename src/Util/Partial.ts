export type Partial <T extends Object> = {
  [P in keyof T]?: T[P]
}
