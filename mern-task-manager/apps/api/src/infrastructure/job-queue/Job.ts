export interface Job {
  id: string
  name: string
  payload: any
  attempts: number
  maxAttempts: number
  status: 'pending' | 'processing' | 'failed' | 'completed'
  createdAt: Date
  updatedAt: Date
}
