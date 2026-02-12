export interface JobQueue {
  dispatch(
    name: string,
    payload: any,
    options?: { maxAttempts?: number }
  ): Promise<void>
}
