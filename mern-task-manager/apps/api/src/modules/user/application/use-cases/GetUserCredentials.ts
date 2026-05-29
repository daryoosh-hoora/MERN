import { IUserRepository } from '../ports/outbound/IUserRepository'
import { IQuery } from '@/shared/application/query-bus/IQuery'
import { IQueryHandler } from '@/shared/application/query-bus/IQueryHandler'
import { NotFoundError } from '@/shared/errors/NotFoundError'
import { IGetUserCredentialsDTO } from '@/shared/application/dto/IGetUserCredentialsDTO'

export class GetUserCredentialsQuery 
implements IQuery<IGetUserCredentialsDTO> {
  
  constructor(
    public readonly email: string
  ) { }
}

export class GetUserCredentialsHandler  
implements IQueryHandler<GetUserCredentialsQuery, IGetUserCredentialsDTO> {

  constructor(
    private readonly repository: IUserRepository
  ) { }

  async execute(query: GetUserCredentialsQuery): Promise<IGetUserCredentialsDTO> {
    const user = await this.repository.findByEmail(query.email)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    return {
      id: user.id.toString(),
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      isActive: user.isActive
    }
  }
}
