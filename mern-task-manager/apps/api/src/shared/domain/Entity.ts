import { date } from 'zod'
import { UniqueEntityId } from './UniqueEntityId'

export abstract class Entity<T> {

  protected readonly _id: UniqueEntityId
  protected _isActive: boolean
  protected _createdAt: Date
  protected _updatedAt: Date
  protected _deletedAt?: Date | null
  protected props: T

  protected constructor(
    props: T, 
    id?: UniqueEntityId 
  ) {
    this._id = id ?? new UniqueEntityId()
    
    this._isActive = true
    this._createdAt = new Date()
    this._updatedAt = this.createdAt
    this._deletedAt = null

    this.props = props
  }

  //getters
  public get id(): UniqueEntityId {
    return this._id
  }
  public get isActive(): boolean {
    return this._isActive
  }
  public get createdAt(): Date {
    return this._createdAt
  }
  public get updatedAt(): Date {
    return this._updatedAt
  }
  public get deletedAt(): Date | null {
    return this._deletedAt || null
  }

  public equals(object?: Entity<T>): boolean {
    if (!object) return false
    if (this === object) return true
    return this._id.equals(object._id)
  }
}
