export class TaskAlreadyStartedError extends Error {
  constructor() {
    super('Task already started')
  }
}

export class TaskAlreadyCompletedError extends Error {
  constructor() {
    super('Task already completed')
  }
}

export class TaskTitleIsRequiredError extends Error {
  constructor() {
    super('Task title is required')
  }
}

export class TaskTitleMinLengthError extends Error {
  constructor() {
    super('Task title must be at least 3 characters')
  }
}

export class TaskTitleMaxLengthError extends Error {
  constructor() {
    super('Task title is too long')
  }
}