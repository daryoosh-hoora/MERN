import { Result } from '@/shared/domain/Result'
import { AggregateRoot } from '@/shared/domain/AggregateRoot'
import { UniqueEntityId } from '@/shared/domain/UniqueEntityId'
import { TaskCreatedEvent } from '../events/TaskCreatedEvent'
import { TaskStartedEvent } from '../events/TaskStartedEvent'
import { TaskCompletedEvent } from '../events/TaskCompletedEvent'
import { TaskUpdatedEvent } from '../events/TaskUpdatedEvent'
import { TaskDeletedEvent } from '../events/TaskDeletedEvent'
import { TaskTitle } from '../value-objects/TaskTitle'
import { TaskStatus } from '../value-objects/TaskStatus'
import { TaskDescription } from '../value-objects/TaskDescription'
import {
  TaskAlreadyStartedError,
  TaskAlreadyCompletedError,
  TaskAlreadyPendingError
} from '../errors/TaskErrors'

export type TaskProps = {
  title: TaskTitle
  description?: TaskDescription | null
  status: TaskStatus
  ownerId: string
}

export class Task extends AggregateRoot<TaskProps> {

  private constructor(props: TaskProps, id?: UniqueEntityId) {
    super(props, id)
  }

  public static create(ownerId: string, title: string, description?: string): Result<Task> {
    const task = new Task({
      title: TaskTitle.create(title),
      description: description ? TaskDescription.create(description) : null,
      status: TaskStatus.pending(),
      ownerId: ownerId
    })

    task.addDomainEvent(
      new TaskCreatedEvent(task._id)
    )

    return Result.ok(task)
  }

  // getters
  public get title(): TaskTitle {
    return this.props.title
  }
  public get description(): TaskDescription | null {
    return this.props.description || null
  }
  public get status(): TaskStatus {
    return this.props.status
  }
  public get ownerId(): string {
    return this.props.ownerId
  }

  public isOwnedBy(userId: string): boolean {
    return this.ownerId === userId
  }

  //behavior
  public start(): void {
    if (this.props.status.value === 'started') {
      throw new TaskAlreadyStartedError()
    }

    this.props.status = TaskStatus.started()
    this._updatedAt = new Date()

    this.addDomainEvent(
      new TaskStartedEvent(this._id)
    )
  }

  public complete(): void {
    if (this.props.status.value === 'completed') {
      throw new TaskAlreadyCompletedError()
    }

    this.props.status = TaskStatus.completed()
    this._updatedAt = new Date()

    this.addDomainEvent(
      new TaskCompletedEvent(this._id)
    )
  }

  public pending(): void {
    if (this.props.status.value === 'pending') {
      throw new TaskAlreadyPendingError()
    }

    this.props.status = TaskStatus.pending()
    this._updatedAt = new Date()

    this.addDomainEvent(
      new TaskUpdatedEvent(this._id)
    )
  }

  public updateTitle(title: string) {
    this.props.title = TaskTitle.create(title)
    this._updatedAt = new Date()

    this.addDomainEvent(
      new TaskUpdatedEvent(this._id)
    )
  }

  updateDescription(description: string) {
    this.props.description = TaskDescription.create(description)
    this._updatedAt = new Date()

    this.addDomainEvent(
      new TaskUpdatedEvent(this._id)
    )
  }

  public delete() {
    this._isActive = false
    this._deletedAt = new Date()

    this.addDomainEvent(
      new TaskDeletedEvent(this._id)
    )
  }

  public static rehydrate(id: string, props: TaskProps): Task {
    return new Task(props, new UniqueEntityId(id))
  }
}
