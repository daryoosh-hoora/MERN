export interface IUserResponseDTO {
  id: string //UniqueEntityId
  email: string
  //passwordHash: string
  role: string //'user' | 'admin' | 'guest'  //UserRoleEnum
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}