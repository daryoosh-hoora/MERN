import { ICommand } from './ICommand'

export interface ICommandBus {
  execute<TCommand extends ICommand, TResult>(
    command: TCommand
  ): Promise<TResult>
}
