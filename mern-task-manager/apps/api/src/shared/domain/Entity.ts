import { UniqueEntityId } from './UniqueEntityId'

export abstract class Entity<T> {

  protected readonly _id: UniqueEntityId
  protected props: T

  protected constructor(props: T,id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId()
    this.props = props
  }

  get id(): UniqueEntityId {
    return this._id
  }

  equals(object?: Entity<T>): boolean {
    if (!object) return false
    if (this === object) return true
    return this._id.equals(object._id)
  }
}
