import { 
  TaskTitleMaxLengthError, 
  TaskTitleMinLengthError 
} from "../errors/TaskErrors"

export class TaskTitle {
  private constructor(public readonly value: string) {}

  static create(value: string): TaskTitle {
    if (!value || value.trim().length < 3) {
      throw new TaskTitleMinLengthError()
    }

    if (value.length > 100) {
      throw new TaskTitleMaxLengthError()
    }

    return new TaskTitle(value.trim())
  }
}
