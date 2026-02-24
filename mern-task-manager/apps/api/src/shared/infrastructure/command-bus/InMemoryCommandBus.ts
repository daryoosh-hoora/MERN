import { ICommand } from '@/shared/application/command-bus/ICommand'
import { ICommandBus } from '@/shared/application/command-bus/ICommandBus'
import { ICommandHandler } from '@/shared/application/command-bus/ICommandHandler'
import { ICommandMiddleware } from '@/shared/application/command-bus/ICommandMiddleware'

export class InMemoryCommandBus implements ICommandBus {
  private handlers = new Map<string, ICommandHandler<any, any>>()
  private middlewares: ICommandMiddleware[] = []

  register<TCommand extends ICommand, TResult>(
    commandName: string,
    handler: ICommandHandler<TCommand, TResult>
  ) {
    this.handlers.set(commandName, handler)
  }

  addMiddleware(middleware: ICommandMiddleware) {
    this.middlewares.push(middleware)
  }

  async execute<TCommand extends ICommand, TResult>(
    command: TCommand
  ): Promise<TResult> {
    const handler = this.handlers.get(command.constructor.name)

    if (!handler) {
      throw new Error(
        `No command handler registered for ${command.constructor.name}`
      )
    }

    let index = -1

    const dispatch = async (): Promise<TResult> => {
      index++

      if (index < this.middlewares.length) {
        return this.middlewares[index].handle(command, dispatch)
      }

      return handler.execute(command)
    }

    return dispatch()
  }
}