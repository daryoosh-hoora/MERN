import { AggregateRoot } from '@/shared/domain/AggregateRoot'

export interface IUnitOfWork {
  registerAggregate(aggregate: AggregateRoot): void

  commit(): Promise<void>

  rollback(): Promise<void>
}