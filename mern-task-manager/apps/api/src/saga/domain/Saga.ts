import { DomainEvent } from '../../shared/domain/DomainEvent'

export abstract class Saga {

  abstract subscribedTo(): string[]

  abstract handle(event: DomainEvent): Promise<void>
}
