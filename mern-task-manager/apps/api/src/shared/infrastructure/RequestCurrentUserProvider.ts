import { ICurrentUserProvider } from '../application/CurrentUserProvider'
import { RequestContext } from './RequestContext'

export class RequestCurrentUserProvider
  implements ICurrentUserProvider
{
  getUserId(): string | undefined {
    return RequestContext.getUserId()
  }
}
