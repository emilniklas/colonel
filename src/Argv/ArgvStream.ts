export class ArgvStream {
  private _index = 0

  constructor (
    private _items: string[]
  ) {}

  next (): string {
    if (this.isEmpty) {
      throw new Error('ArgvStream is empty')
    }

    const next = this._items[this._index]

    this._index++

    return next
  }

  previous (): string {
    if (this._index === 0) {
      throw new Error('ArgvStream is at the beginning')
    }

    const next = this._items[this._index]

    this._index--

    return next
  }

  get isEmpty (): boolean {
    return this._index >= this._items.length
  }
}
