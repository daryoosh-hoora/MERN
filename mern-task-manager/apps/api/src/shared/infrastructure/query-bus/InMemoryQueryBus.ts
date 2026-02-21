import { IQuery } from '../../application/query-bus/IQuery'
import { IQueryBus } from '../../application/query-bus/IQueryBus'
import { IQueryHandler } from '../../application/query-bus/IQueryHandler'

export class InMemoryQueryBus implements IQueryBus {
  private handlers = new Map<string, IQueryHandler<any, any>>()

  register<TQuery extends IQuery<TResult>, TResult>(
    queryName: string,
    handler: IQueryHandler<TQuery, TResult>
  ) {
    this.handlers.set(queryName, handler)
  }

  async execute<TQuery extends IQuery<TResult>, TResult>(
    query: TQuery
  ): Promise<TResult> {
    const handler = this.handlers.get(query.constructor.name)

    if (!handler) {
      throw new Error(
        `No query handler registered for ${query.constructor.name}`
      )
    }

    return handler.execute(query)
  }
}