import { IQuery } from './IQuery'

export interface IQueryBus {
  execute<TQuery extends IQuery<TResult>, TResult>(
    query: TQuery
  ): Promise<TResult>
}