import { JwtTokenService } from "@/shared/infrastructure/security/JwtTokenService";
import { JwtTokenVerifier } from "@/shared/infrastructure/security/JwtTokenVerifier";
import { InMemoryCommandBus } from "@/shared/infrastructure/command-bus/InMemoryCommandBus";
import { InMemoryQueryBus } from "@/shared/infrastructure/query-bus/InMemoryQueryBus";
import { InMemoryDomainEventDispatcher } from "@/shared/infrastructure/domain-event/InMemoryDomainEventDispatcher";
import { InMemoryUnitOfWork } from "@/shared/infrastructure/unit-of-work/InMemoryUnitOfWork";
import { BcryptPasswordHasher } from "@/shared/infrastructure/security/BcryptPasswordHasher";
import { LoggingMiddleware } from "@/presentation/http/middlewares/logging.middleware";
import { TransactionMiddleware } from "@/presentation/http/middlewares/transaction.middleware";
import { LoginCommand, LoginHandler } from "../../application/use-cases/Login";
import { AuthenticationApplicationService } from "../adapters/AuthenticationApplicationService";
import { AuthenticationController } from "../../api/AuthenticationController";
import { createAuthenticationRouter } from "../../api/authentication.routes";
import { IAuthenticationModule } from "../../application/ports/inbound/IAuthenticationModule";
import { UserExternalService } from "../adapters/UserExternalService";

export function createAuthenticationModule(): IAuthenticationModule {
  const jwtSecret = process.env.JWT_SECRET!
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not defined')
  }

  const tokenService = new JwtTokenService(jwtSecret)
  const tokenVerifier = new JwtTokenVerifier(jwtSecret)

  const userExternalService = new UserExternalService()

  const commandBus = new InMemoryCommandBus()
  const queryBus = new InMemoryQueryBus()

  const dispatcher = new InMemoryDomainEventDispatcher()
  const unitOfWork = new InMemoryUnitOfWork(dispatcher)

  const passwordHasher = new BcryptPasswordHasher()
  
  commandBus.addMiddleware(new LoggingMiddleware())
  commandBus.addMiddleware(new TransactionMiddleware(unitOfWork))

  // register handlers
  const loginHandler = new LoginHandler(userExternalService, passwordHasher, tokenService)

  commandBus.register(
    LoginCommand.name,
    loginHandler
  )
  
  const applicationService = new AuthenticationApplicationService(
    commandBus,
    queryBus
  )

  const controller = new AuthenticationController(applicationService)
  const router = createAuthenticationRouter(controller)

  return {
    applicationService: applicationService,
    router: router
  }
}