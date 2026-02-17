import { randomUUID } from 'crypto'
import { AggregateRoot } from "@/shared/domain/AggregateRoot"
import { TaskCreatedEvent } from "../events/TaskCreatedEvent"
import { TaskStartedEvent } from '../events/TaskStartedEvent'
import { TaskCompletedEvent } from "../events/TaskCompletedEvents"
import { TaskDeletedEvent } from '../events/TaskDeletedEvent'
import { TaskTitle } from "../value-objects/TaskTitle"
import { TaskStatus } from "../value-objects/TaskStatus"
import { TaskDescription } from "../value-objects/TaskDescription"
import {
  TaskAlreadyStartedError,
  TaskAlreadyCompletedError
} from '../errors/TaskErrors'

type TaskProps = {
  title: TaskTitle
  description?: TaskDescription | null
  status: TaskStatus
  ownerId: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export class Task extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    private props: TaskProps
  ) {
    super()
  }

  public static create(ownerId: string, title: string, description?: string): Task {
    const task = new Task(randomUUID(), {
      title: TaskTitle.create(title),
      description: description ? TaskDescription.create(description) : null,
      status: TaskStatus.pending(),
      ownerId: ownerId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    })

    task.addDomainEvent(
      new TaskCreatedEvent(task._id)
    )

    return task
  }

  public delete() {
    this.props.isActive = false

    this.addDomainEvent(
      new TaskDeletedEvent(this._id)
    )
  }

  public static rehydrate(id: string, props: TaskProps): Task {
    return new Task(id, props)
  }

  public start(): void {
    if (this.props.status.value === 'started') {
      throw new TaskAlreadyStartedError()
    }

    this.props.status = TaskStatus.started()

    this.addDomainEvent(
      new TaskStartedEvent(this._id)
    )
  }

  public complete(): void {
    if (this.props.status.value === 'completed') {
      throw new TaskAlreadyCompletedError()
    }

    this.props.status = TaskStatus.completed()

    this.addDomainEvent(
      new TaskCompletedEvent(this._id)
    )
  }

  // getters
  public get id(): string {
    return this._id
  }
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
  public get isActive(): boolean {
    return !this.props.isActive
  }
  public get createdAt(): Date {
    return this.props.createdAt
  }
  public get updatedAt(): Date {
    return this.props.updatedAt
  }
  public get deletedAt(): Date | null {
    return this.props.deletedAt || null
  }

  //behavior
  updateTitle(title: string) {
    this.props.title = TaskTitle.create(title)
  }

  updateStatus(status: TaskStatusEnum) {
    this.props.status = TaskStatus.from(status)
  }

  updateDescription(description: string) {
    this.props.description = TaskDescription.create(description)
  }
}
