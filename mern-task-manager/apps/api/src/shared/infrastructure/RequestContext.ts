import { AsyncLocalStorage } from 'node:async_hooks'

interface ContextStore {
  userId?: string
}

const asyncLocalStorage = new AsyncLocalStorage<ContextStore>()

export const RequestContext = {
  run(callback: () => void) {
    asyncLocalStorage.run({}, callback)
  },

  setUserId(userId: string) {
    const store = asyncLocalStorage.getStore()
    if (store) {
      store.userId = userId
    }
  },

  getUserId(): string | undefined {
    return asyncLocalStorage.getStore()?.userId
  }
}
