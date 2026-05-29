/*
In Clean Architecture, wiring happens in 'Composition Root' (here!)
This is the only place where:

- Infrastructure meets Application
- Concrete classes are created
- Dependencies are assembled

Everything else should depend only on interfaces.
*/

import { JwtTokenService } from "@/shared/infrastructure/security/JwtTokenService";
import { IUserModule } from "../../application/ports/inbound/IUserModule";
import { JwtTokenVerifier } from "@/shared/infrastructure/security/JwtTokenVerifier";
import { RegisterUserCommand, RegisterUserHandler } from "../../application/use-cases/RegisterUser";
import { UpdateUserCommand, UpdateUserHandler } from "../../application/use-cases/UpdateUser";
import { DeleteUserCommand, DeleteUserHandler } from "../../application/use-cases/DeleteUser";
import { GetUserByIdHandler, GetUserByIdQuery } from "../../application/use-cases/GetUserById";
import { GetUserByEmailHandler, GetUserByEmailQuery } from "../../application/use-cases/GetUserByEmail";
import { GetAllUsersHandler, GetAllUsersQuery } from "../../application/use-cases/GetAllUsers";
import { MongoUserRepository } from "../persistence/mongodb/repositories/MongoUserRepository";
import { InMemoryCommandBus } from "@/shared/infrastructure/command-bus/InMemoryCommandBus";
import { InMemoryQueryBus } from "@/shared/infrastructure/query-bus/InMemoryQueryBus";
import { InMemoryDomainEventDispatcher } from "@/shared/infrastructure/domain-event/InMemoryDomainEventDispatcher";
import { InMemoryUnitOfWork } from "@/shared/infrastructure/unit-of-work/InMemoryUnitOfWork";
import { LoggingMiddleware } from "@/presentation/http/middlewares/logging.middleware";
import { TransactionMiddleware } from "@/presentation/http/middlewares/transaction.middleware";
import { BcryptPasswordHasher } from "@/shared/infrastructure/security/BcryptPasswordHasher";
import { UserApplicationService } from "../adapters/UserApplicationService";
import { UserController } from "../../api/UserController";
import { createUserRouter } from "../../api/user.routes";
import { GetUserCredentialsHandler, GetUserCredentialsQuery } from "../../application/use-cases/GetUserCredentials";

export function createUserModule(): IUserModule {
  const jwtSecret = process.env.JWT_SECRET!
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not defined')
  }

  const tokenVerifier = new JwtTokenVerifier(jwtSecret)

  const userRepository = new MongoUserRepository()

  const commandBus = new InMemoryCommandBus()
  const queryBus = new InMemoryQueryBus()

  const dispatcher = new InMemoryDomainEventDispatcher()
  const unitOfWork = new InMemoryUnitOfWork(dispatcher)

  const passwordHasher = new BcryptPasswordHasher()

  commandBus.addMiddleware(new LoggingMiddleware())
  commandBus.addMiddleware(new TransactionMiddleware(unitOfWork))

  // register handlers
  commandBus.register(
    RegisterUserCommand.name,
    new RegisterUserHandler(userRepository, passwordHasher)
  )

  commandBus.register(
    UpdateUserCommand.name,
    new UpdateUserHandler(userRepository)
  )

  commandBus.register(
    DeleteUserCommand.name,
    new DeleteUserHandler(userRepository)
  )

  queryBus.register(
    GetUserByIdQuery.name,
    new GetUserByIdHandler(userRepository)
  )

  queryBus.register(
    GetUserByEmailQuery.name,
    new GetUserByEmailHandler(userRepository)
  )

  queryBus.register(
    GetAllUsersQuery.name,
    new GetAllUsersHandler(userRepository)
  )

  queryBus.register(
    GetUserCredentialsQuery.name,
    new GetUserCredentialsHandler(userRepository)
  )

  const userApplicationService = new UserApplicationService(
    commandBus,
    queryBus
  )
  const userController = new UserController(userApplicationService)
  const router = createUserRouter(userController, tokenVerifier)

  return {
    applicationService: userApplicationService,
    router: router
  }
}