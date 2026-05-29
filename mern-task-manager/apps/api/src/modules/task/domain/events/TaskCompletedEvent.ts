import { IDomainEvent } from '@/shared/domain/IDomainEvent'
import { UniqueEntityId } from '@/shared/domain/UniqueEntityId'

export class TaskCompletedEvent implements IDomainEvent {
  // public dateTimeOccurred: Date

  constructor(public readonly taskId: UniqueEntityId) {
    // this.dateTimeOccurred = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.taskId
  }
}
// import { DomainEvent } from '@/shared/domain/IDomainEvent'

// export class TaskCompletedEvent extends DomainEvent {

//   readonly eventName = 'task.completed'

//   constructor(
//     public readonly taskId: string
//   ) {
//     super()
//   }

//   toPrimitives() {
//     return {
//       taskId: this.taskId
//     }
//   }
// }
