import { UniqueEntityId } from "@/shared/domain/UniqueEntityId"

export interface IUpdateTaskResponseDTO {
  id: UniqueEntityId
  ownerId: string
  title: string
  description?: string | null
  status: string
  createdAt: Date
  updatedAt: Date
}
