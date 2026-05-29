export class Email {
  private constructor(public readonly value: string) {}

  static create(value: string): Email {
    if (!isValidEmail(value)) {
      throw new InvalidEmailError(value)
    }

    return new Email(value.trim().toLowerCase())
  }
}

// errors
class InvalidEmailError extends Error {
  constructor(email: string) {
    super(`Invalid email: ${email}`)
  }
}

// helpers
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}