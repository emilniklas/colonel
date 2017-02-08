export class ArgvStream {
  constructor (
    private _items: string[]
  ) {}

  next (): string {
    if (this.isEmpty) {
      throw new Error('ArgvStream is empty')
    }

    const next = this._items[0]

    this._items = this._items.slice(1)

    return next
  }

  get isEmpty (): boolean {
    return this._items.length === 0
  }
}
