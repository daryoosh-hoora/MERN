import { Entity } from './Entity'
import { IDomainEvent } from './IDomainEvent'

export abstract class AggregateRoot<T> extends Entity<T> {

  private _domainEvents: IDomainEvent[] = []

  get domainEvents(): IDomainEvent[] {
    return this._domainEvents
  }

  protected addDomainEvent(event: IDomainEvent): void {
    this._domainEvents.push(event)
  }

  public clearDomainEvents(): void {
    this._domainEvents = []
  }
}
