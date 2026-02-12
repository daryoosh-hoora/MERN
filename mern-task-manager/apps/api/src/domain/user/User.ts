import { InvalidEmailError, WeakPasswordError } from './UserErrors.js'

export type UserProps = {
  id: string
  email: string
  passwordHash: string
  role: 'user' | 'admin'
  createdAt: Date
}

export class User {
  private constructor(private readonly props: UserProps) { }

  get id() {
    return this.props.id
  }

  get email() {
    return this.props.email
  }

  get passwordHash() {
    return this.props.passwordHash
  }

  get role() {
    return this.props.role
  }

  get createdAt() {
    return this.props.createdAt
  }

  updateEmail(email: string) {
    if (!email.includes('@')) {
      throw new Error('Invalid email')
    }
    this.props.email = email
  }

  updateRole(role: 'user' | 'admin') {
    this.props.role = role
  }

  /** Factory method */
  static create(params: {
    id: string
    email: string
    passwordHash: string
    role?: 'user' | 'admin'
  }): User {
    if (!isValidEmail(params.email)) {
      throw new InvalidEmailError(params.email)
    }

    if (!params.passwordHash) {
      throw new WeakPasswordError()
    }

    return new User({
      id: params.id,
      email: params.email.toLowerCase(),
      passwordHash: params.passwordHash,
      role: params.role ?? 'user',
      createdAt: new Date()
    })
  }
}

/** Domain helper (not exported) */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
