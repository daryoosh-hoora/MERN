import { ICommand } from '@/shared/application/command-bus/ICommand'
import { ICommandMiddleware } from '@/shared/application/command-bus/ICommandMiddleware'

export class LoggingMiddleware implements ICommandMiddleware {
  async handle<TCommand extends ICommand<TResult>, TResult>(
    command: TCommand,
    next: () => Promise<TResult>
  ): Promise<TResult> {
    console.log(`[Command] ${command.constructor.name} started`)

    const result = await next()

    console.log(`[Command] ${command.constructor.name} finished`)

    return result
  }
}