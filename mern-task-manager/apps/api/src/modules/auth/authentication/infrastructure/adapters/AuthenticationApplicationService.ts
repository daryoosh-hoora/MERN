import { Result } from "@/shared/domain/Result";
import { IQueryBus } from "@/shared/application/query-bus/IQueryBus";
import { ICommandBus } from "@/shared/application/command-bus/ICommandBus";
import { IAuthenticationApplicationService } from "../../application/ports/inbound/IAuthenticationApplicationService";
import { ILoginResponseDTO, LoginCommand } from "../../application/use-cases/Login";

export class AuthenticationApplicationService implements IAuthenticationApplicationService {
  constructor(
    private readonly commandBus: ICommandBus,
    private readonly queryBus: IQueryBus
  ) { }

  login(input: { 
    email: string,
    password: string,
  }): Promise<Result<ILoginResponseDTO>> {
    const loginCommand = new LoginCommand({
      email: input.email,
      password: input.password
    })
    
    return this.commandBus.execute<
      LoginCommand,
      Result<ILoginResponseDTO>
    >(loginCommand)
  }

  logout(): Promise<Result<void>> {
    throw new Error("Method not implemented.")
  }

}