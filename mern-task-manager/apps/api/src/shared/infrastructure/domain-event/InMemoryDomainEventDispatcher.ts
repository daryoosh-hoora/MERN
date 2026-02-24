import { IDomainEvent } from '@/shared/domain/IDomainEvent'
import { IDomainEventDispatcher } from '@/shared/application/domain-event/IDomainEventDispatcher'

export class InMemoryDomainEventDispatcher
  implements IDomainEventDispatcher
{
  async dispatch(events: IDomainEvent[]): Promise<void> {
    for (const event of events) {
      console.log(`[DomainEvent] ${event.constructor.name}`)
    }
  }
}