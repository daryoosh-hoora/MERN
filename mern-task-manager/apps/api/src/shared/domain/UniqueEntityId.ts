import { randomUUID } from 'crypto'

export class UniqueEntityId {

  private readonly _value: string

  constructor(id?: string) {
    this._value = id ?? randomUUID()
    Object.freeze(this)
  }

  get value(): string {
    return this._value
  }

  equals(id?: UniqueEntityId): boolean {
    if (!id) return false
    return id.value === this._value
  }

  toString(): string {
    return this._value
  }
}
