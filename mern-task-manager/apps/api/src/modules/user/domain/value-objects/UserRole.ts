export class UserRole {
  private constructor(public readonly value: string) { }

  static user(): UserRole {
    return new UserRole('user')
  }

  static admin(): UserRole {
    return new UserRole('admin')
  }

  static guest(): UserRole {
    return new UserRole('guest')
  }

  static from(value: string): UserRole {
    if (!['user', 'admin', 'guest'].includes(value)) {
      throw new InvalidUserRoleError()
    }

    return new UserRole(value)
  }
}

// errors
class InvalidUserRoleError extends Error {
  constructor() {
    super('Invalid user role')
  }
}