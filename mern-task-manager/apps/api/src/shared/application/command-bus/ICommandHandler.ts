import { ICommand } from "./ICommand";

export interface ICommandHandler<
  TCommand extends ICommand<TResult>,
  TResult
> {
  execute(command: TCommand): Promise<TResult>
}