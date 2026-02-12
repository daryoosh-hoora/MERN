export class GetTaskByIdQuery {
  constructor(
    public readonly taskId: string,
    public readonly requesterId: string,
    public readonly requesterRole: string
  ) {}
}
