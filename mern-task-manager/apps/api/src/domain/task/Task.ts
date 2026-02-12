import { TaskStatus } from './TaskStatus.js'
import { randomUUID } from 'crypto'
import { DomainEvent } from '../../shared/domain/DomainEvent.js'
import { TaskCreatedEvent } from './events/TaskCreatedEvent.js'

type TaskProps = {
  title: string
  description?: string
  status: TaskStatus
  ownerId: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export class Task {
  private constructor(
    private readonly _id: string,
    private props: TaskProps,
    skipValidation = false
  ) {
    if (!skipValidation) {
      if (!props.title) {
        throw new Error('Title is required')
      }
    }

    Object.assign(this, props)
  }

  private domainEvents: DomainEvent[] = []

  private addDomainEvent(event: DomainEvent) {
    this.domainEvents.push(event)
  }

  static create(input: {
    title: string
    description?: string
    ownerId: string
  }): Task {
    if (!input.title || input.title.length < 3) {
      throw new Error('Task title too short')
    }

    const task = new Task(randomUUID(), {
      title: input.title,
      description: input.description,
      status: 'do',
      ownerId: input.ownerId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    })

    task.addDomainEvent(
      new TaskCreatedEvent(task.id, task.ownerId)
    )

    return task
  }

  static rehydrate(id: string, props: TaskProps): Task {
    return new Task(id, props, true)
  }

  // getters
  get id() { return this._id }
  get title() { return this.props.title }
  get description() { return this.props.description }
  get status() { return this.props.status }
  get ownerId() { return this.props.ownerId }
  get createdAt() { return this.props.createdAt }
  get updatedAt() { return this.props.updatedAt }
  get deletedAt() { return this.props.deletedAt }

  // behavior
  updateTitle(title: string) {
    if (title.length < 3) {
      throw new Error('Task title too short')
    }
    this.props.title = title
  }

  updateStatus(status: TaskStatus) {
    this.props.status = status
  }

  softDelete() {
    this.props.isActive = false
  }

  isDeleted() {
    return !this.props.isActive
  }

  pullDomainEvents(): DomainEvent[] {
    const events = this.domainEvents
    this.domainEvents = []
    return events
  }
}
