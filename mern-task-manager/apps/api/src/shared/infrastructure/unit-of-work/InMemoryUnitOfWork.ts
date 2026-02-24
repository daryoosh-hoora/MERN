import { AggregateRoot } from '@/shared/domain/AggregateRoot'
import { IUnitOfWork } from '@/shared/application/unit-of-work/IUnitOfWork'
import { IDomainEventDispatcher } from '@/shared/application/domain-event/IDomainEventDispatcher'

export class InMemoryUnitOfWork implements IUnitOfWork {
  private aggregates: AggregateRoot[] = []

  constructor(
    private readonly dispatcher: IDomainEventDispatcher
  ) {}

  registerAggregate(aggregate: AggregateRoot): void {
    this.aggregates.push(aggregate)
  }

  async commit(): Promise<void> {
    const domainEvents = this.aggregates.flatMap(a =>
      a.pullDomainEvents()
    )

    await this.dispatcher.dispatch(domainEvents)

    this.aggregates = []
  }

  async rollback(): Promise<void> {
    this.aggregates = []
  }
}