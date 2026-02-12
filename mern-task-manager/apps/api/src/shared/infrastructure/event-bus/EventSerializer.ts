import { DomainEvent } from '../../domain/DomainEvent.js'

export interface SerializedEvent {
  eventId: string
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

