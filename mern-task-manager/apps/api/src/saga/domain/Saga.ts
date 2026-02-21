import { DomainEvent } from '../../shared/domain/IDomainEvent'

export abstract class Saga {

  abstract subscribedTo(): string[]

  abstract handle(event: DomainEvent): Promise<void>
}
