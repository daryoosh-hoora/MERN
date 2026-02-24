import { ICommand } from './ICommand'

export interface ICommandMiddleware {
  handle<TCommand extends ICommand<TResult>, TResult>(
    command: TCommand,
    next: () => Promise<TResult>
  ): Promise<TResult>
}