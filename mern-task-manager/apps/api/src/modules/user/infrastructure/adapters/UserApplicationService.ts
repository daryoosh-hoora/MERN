import { Result } from "@/shared/domain/Result";
import { IQueryBus } from "@/shared/application/query-bus/IQueryBus";
import { ICommandBus } from "@/shared/application/command-bus/ICommandBus";
import { IUserApplicationService } from "../../application/ports/inbound/IUserApplicationService";
import { IUserResponseDTO } from "../../application/dto/IUserResponseDTO";
import { RegisterUserCommand } from "../../application/use-cases/RegisterUser";
import { UpdateUserCommand } from "../../application/use-cases/UpdateUser";
import { GetUserByIdQuery } from "../../application/use-cases/GetUserById";
import { GetUserByEmailQuery } from "../../application/use-cases/GetUserByEmail";
import { GetAllUsersQuery } from "../../application/use-cases/GetAllUsers";
import { DeleteUserCommand } from "../../application/use-cases/DeleteUser";
import { IGetUserCredentialsDTO } from "@/shared/application/dto/IGetUserCredentialsDTO";
import { GetUserCredentialsQuery } from "../../application/use-cases/GetUserCredentials";

export enum UserRoleEnum {
  USER = 'user',
  ADMIN = 'admin',
  GUEST = 'guest',
}

export class UserApplicationService implements IUserApplicationService {
  constructor(
    private readonly commandBus: ICommandBus,
    private readonly queryBus: IQueryBus
  ) { }

  registerUser(input: {
    email: string,
    password: string,
    role?: string
  }): Promise<Result<IUserResponseDTO>> {
    console.log(input)
    const registerUserCommand = new RegisterUserCommand({
      email: input.email,
      password: input.password,
      role: input.role || UserRoleEnum.USER.toString()
    })
    
    return this.commandBus.execute<
    RegisterUserCommand,
    Result<IUserResponseDTO>
    >(registerUserCommand)
  }
  
  updateUser(input: { 
    id: string 
    email?: string 
    role?: string 
  }): Promise<Result<IUserResponseDTO>> {
    const updateUserCommand = new UpdateUserCommand({
      id: input.id,
      email: input.email,
      role: input.role
    })
    
    return this.commandBus.execute<
    UpdateUserCommand,
    Result<IUserResponseDTO>
    >(updateUserCommand)
  }

  deleteUser(input: { 
    id: string
    permanently?: boolean
  }): Promise<Result<void>> {
    const deleteUserCommand = new DeleteUserCommand({
      id: input.id,
      permanently: input.permanently ?? false
    })

    return this.commandBus.execute<
      DeleteUserCommand,
      Result<void>
    >(deleteUserCommand)
  }

  getUserById(input: {
    id: string
  }): Promise<IUserResponseDTO> {
    const query = new GetUserByIdQuery(input.id)
    
    return this.queryBus.execute<
      GetUserByIdQuery,
      IUserResponseDTO
    >(query)
  }

  getUserByEmail(input: {
    email: string
  }): Promise<IUserResponseDTO> {
    const query = new GetUserByEmailQuery(input.email)

    return this.queryBus.execute<
      GetUserByEmailQuery,
      IUserResponseDTO
    >(query)
  }

  getAllUsers(input: {
    limit?: number
    offset?: number
    role?: UserRoleEnum
    sortField?: string
    sortDirection?: string
  }): Promise<IUserResponseDTO[]> {
    const query = new GetAllUsersQuery(
      input.limit,
      input.offset,
      input.role,
      input.sortField,
      input.sortDirection
    )

    return this.queryBus.execute<
      GetAllUsersQuery,
      IUserResponseDTO[]
    >(query)
  }

  getUserCredentials(input: { 
    email: string 
  }): Promise<IGetUserCredentialsDTO> {
    const query = new GetUserCredentialsQuery(input.email)

    return this.queryBus.execute<
      GetUserCredentialsQuery,
      IGetUserCredentialsDTO
    >(query)
  }
}