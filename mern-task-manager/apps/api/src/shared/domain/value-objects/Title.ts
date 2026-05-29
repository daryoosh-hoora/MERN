export class Title {
  private constructor(public readonly value: string) {}

  static create(value: string): Title {
    if (!value || value.trim().length < 3) {
      throw new TitleMinLengthError()
    }

    if (value.length > 100) {
      throw new TitleMaxLengthError()
    }

    return new Title(value.trim())
  }
}

// errors
class TitleMinLengthError extends Error {
  constructor() {
    super('Title must be at least 3 characters')
  }
}

class TitleMaxLengthError extends Error {
  constructor() {
    super('Title is too long')
  }
}