import { UniqueEntityId } from '@/shared/domain/UniqueEntityId'

export interface ICreateTaskResponseDTO {
  id: UniqueEntityId
  ownerId: string
  title: string
  description?: string | null
  status: string
  createdAt: Date
}
