import { ICommand } from '../../application/command-bus/ICommand'
import { ICommandBus } from '../../application/command-bus/ICommandBus'
import { ICommandHandler } from '../../application/command-bus/ICommandHandler'

export class InMemoryCommandBus implements ICommandBus {

  private handlers = new Map<string, ICommandHandler<any, any>>()

  register<TCommand extends ICommand>(
    commandName: string,
    handler: ICommandHandler<TCommand, any>
  ) {
    this.handlers.set(commandName, handler)
  }

  async execute<TCommand extends ICommand, TResult>(
    command: TCommand
  ): Promise<TResult> {

    const commandName = command.constructor.name

    const handler = this.handlers.get(commandName)

    if (!handler) {
      throw new Error(
        `No handler registered for command: ${commandName}`
      )
    }

    return handler.execute(command)
  }
}
