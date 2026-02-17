export class TaskDescription {
  private constructor(public readonly value: string) {}

  static create(value: string): TaskDescription {
    if (value.length > 100) {
      throw new Error('Task description too long')
    }

    return new TaskDescription(value.trim())
  }
}
