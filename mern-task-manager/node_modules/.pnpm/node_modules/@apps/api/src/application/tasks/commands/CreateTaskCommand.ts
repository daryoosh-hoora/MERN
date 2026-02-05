import { CreateTaskDTO } from '../dto/CreateTaskDTO.js'

export class CreateTaskCommand {
  constructor(
    public readonly ownerId: string,
    public readonly data: CreateTaskDTO
  ) {}
}
