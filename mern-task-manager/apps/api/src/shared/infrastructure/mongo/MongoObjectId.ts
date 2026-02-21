import { Types } from 'mongoose'

export class MongoObjectId {

  private readonly _value: string

  constructor(id?: string) {
    this._value = id ?? new Types.ObjectId().toString()
  }

  get value(): string {
    return this._value
  }

  equals(id?: MongoObjectId): boolean {
    if (!id) return false
    return id.value === this._value
  }

  toString(): string {
    return this._value
  }
}