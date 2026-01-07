export class InvalidEmailError extends Error {
  constructor(email: string) {
    super(`Invalid email: ${email}`)
  }
}

export class WeakPasswordError extends Error {
  constructor() {
    super('Password does not meet security requirements')
  }
}
