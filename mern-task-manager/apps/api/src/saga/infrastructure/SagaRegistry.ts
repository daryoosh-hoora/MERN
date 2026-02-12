import { BrokerEventBus } from '../../shared/infrastructure/event-bus/BrokerEventBus.js'
import { Saga } from '../domain/Saga.js'
import { idempotent } from '../../shared/infrastructure/event-bus/IdempotentConsumer.js'

export class SagaRegistry {

  constructor(
    private readonly eventBus: BrokerEventBus,
    private readonly sagas: Saga[]
  ) {}

  register() {

    for (const saga of this.sagas) {

      for (const eventName of saga.subscribedTo()) {

        this.eventBus.subscribe(
          eventName,
          idempotent(async (serializedEvent) => {
            await saga.handle(serializedEvent)
          })
        )
      }
    }
  }
}
