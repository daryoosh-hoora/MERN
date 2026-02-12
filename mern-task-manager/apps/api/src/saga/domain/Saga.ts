import { DomainEvent } from '../../shared/domain/DomainEvent.js'

export abstract class Saga {

  abstract subscribedTo(): string[]

  abstract handle(event: DomainEvent): Promise<void>
}
