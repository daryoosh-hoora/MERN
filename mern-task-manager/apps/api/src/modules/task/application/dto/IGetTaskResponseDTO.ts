export interface IGetTaskByIdResponseDTO {
  id: string
  title: string
  description?: string | null
  status: string
  ownerId: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}