import { IDomainEvent } from '@/shared/domain/IDomainEvent'

export interface IDomainEventDispatcher {
  dispatch(events: IDomainEvent[]): Promise<void>
}