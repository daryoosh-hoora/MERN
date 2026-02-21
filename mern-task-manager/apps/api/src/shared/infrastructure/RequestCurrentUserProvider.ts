import { ICurrentUserProvider } from '../application/ICurrentUserProvider'
import { RequestContext } from './RequestContext'

export class RequestCurrentUserProvider
  implements ICurrentUserProvider
{
  getUserId(): string | undefined {
    return RequestContext.getUserId()
  }
}
