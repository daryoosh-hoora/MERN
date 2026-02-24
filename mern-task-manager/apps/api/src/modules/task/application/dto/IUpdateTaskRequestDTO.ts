export interface IUpdateTaskRequestDTO {
  taskId: string
  title?: string
  description?: string
  status?: TaskStatusEnum
}
