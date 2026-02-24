import { Entity } from './Entity'
import { IDomainEvent } from './IDomainEvent'

export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: IDomainEvent[] = []

  protected addDomainEvent(event: IDomainEvent): void {
    this._domainEvents.push(event)
  }

  protected get domainEvents(): IDomainEvent[] {
    return this._domainEvents
  }
  public pullDomainEvents(): IDomainEvent[] {
    const events = this.domainEvents
    this._domainEvents = []
    return events
  }
}