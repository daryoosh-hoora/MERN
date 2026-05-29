export class Password {
  private constructor(public readonly value: string) { }

  static create(value: string): Password {
    if (isWeekPassword(value)) {
      throw new WeakPasswordError()
    }

    return new Password(value.trim())
  }
}

// errors
class WeakPasswordError extends Error {
  constructor() {
    super('Password does not meet security requirements')
  }
}

// helpers
function isWeekPassword(password: string): boolean {
  return !password || 
    password.trim().length < 8
}