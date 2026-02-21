import { UniqueEntityId } from '@/shared/domain/UniqueEntityId'
import { DomainEvent } from '../../domain/DomainEvent'
export interface SerializedEvent {
  eventId: UniqueEntityId
  eventName: string
  occurredOn: Date
  payload: any
}

export class EventSerializer {

  static serialize(event: DomainEvent): SerializedEvent {
    return {
      eventId: event.eventId,
      eventName: event.eventName,
      occurredOn: event.occurredOn,
      payload: event.toPrimitives()
    }
  }
}

