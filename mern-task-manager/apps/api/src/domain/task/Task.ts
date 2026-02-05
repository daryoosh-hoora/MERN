import { TaskStatus } from './TaskStatus.js'
import { randomUUID } from 'crypto'

type TaskProps = {
  title: string
  description?: string
  status: TaskStatus
  ownerId: string
  isActive: boolean
  createdAt: Date
}

export class Task {
  private constructor(
    private readonly _id: string,
    private props: TaskProps
  ) {}

  static create(input: {
    title: string
    description?: string
    ownerId: string
  }): Task {
    if (!input.title || input.title.length < 3) {
      throw new Error('Task title too short')
    }

    return new Task(randomUUID(), {
      title: input.title,
      description: input.description,
      status: 'do',
      ownerId: input.ownerId,
      isActive: true,
      createdAt: new Date()
    })
  }

  static rehydrate(
    id: string,
    props: TaskProps
  ): Task {
    return new Task(id, props)
  }

  // getters
  get id() { return this._id }
  get title() { return this.props.title }
  get description() { return this.props.description }
  get status() { return this.props.status }
  get ownerId() { return this.props.ownerId }
  get createdAt() { return this.props.createdAt }

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
}
