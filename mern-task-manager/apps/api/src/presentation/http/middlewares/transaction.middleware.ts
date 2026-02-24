import { ICommandMiddleware } from '@/shared/application/command-bus/ICommandMiddleware'
import { ICommand } from '@/shared/application/command-bus/ICommand'
import { IUnitOfWork } from '@/shared/application/unit-of-work/IUnitOfWork'

export class TransactionMiddleware implements ICommandMiddleware {
  constructor(private readonly unitOfWork: IUnitOfWork) {}

  async handle<TCommand extends ICommand<TResult>, TResult>(
    command: TCommand,
    next: () => Promise<TResult>
  ): Promise<TResult> {
    try {
      const result = await next()

      await this.unitOfWork.commit()

      return result
    } catch (error) {
      await this.unitOfWork.rollback()
      throw error
    }
  }
}