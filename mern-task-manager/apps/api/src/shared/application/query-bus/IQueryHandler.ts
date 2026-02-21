import { IQuery } from './IQuery'

export interface IQueryHandler<
  TQuery extends IQuery<TResult>,
  TResult
> {
  execute(query: TQuery): Promise<TResult>
}