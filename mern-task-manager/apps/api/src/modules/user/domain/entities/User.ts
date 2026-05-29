import { Result } from '@/shared/domain/Result'
import { AggregateRoot } from '@/shared/domain/AggregateRoot'
import { UniqueEntityId } from '@/shared/domain/UniqueEntityId'
import { UserRegisteredEvent } from '../events/UserRegisteredEvent'
import { Email } from '@/shared/domain/value-objects/Email'
import { Password } from '@/shared/domain/value-objects/Password'
import { UserRole } from '../value-objects/UserRole'

// types
type UserProps = {
  email: Email
  passwordHash: string
  role: UserRole
}

export class User extends AggregateRoot<UserProps> {
  private constructor(
    props: UserProps,
    id?: UniqueEntityId
  ) {
    super(props, id)
  }

  static create(
    email: string,
    passwordHash: string,
    role?: string
  ): Result<User> {
    const user = new User({
      email: Email.create(email),
      passwordHash: passwordHash,
      role: role ? UserRole.from(role) : UserRole.user()
    })

    user.addDomainEvent(
      new UserRegisteredEvent(user._id)
    )

    return Result.ok(user)
  }

  // getters
  get email(): string {
    return this.props.email.value
  }
  get role(): string {
    return this.props.role.value
  }
  get passwordHash(): string {
    return this.props.passwordHash
  }

  updateEmail(email: string) {
    this.props.email = Email.create(email)
  }

  updateRole(role: string) {
    this.props.role = UserRole.from(role) ?? UserRole.user()
  }

  static rehydrate(
    id: string,
    email: string,
    passwordHash: string,
    role?: string
  ): User {
    const user = new User({
      email: Email.create(email),
      passwordHash: passwordHash,
      role: role ? UserRole.from(role) : UserRole.user()
    }, new UniqueEntityId(id))

    return user
  }
}
