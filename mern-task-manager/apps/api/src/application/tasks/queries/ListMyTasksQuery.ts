export class ListMyTasksQuery {
  constructor(
    public readonly ownerId: string,
    public readonly limit: number,
    public readonly offset: number,
    public readonly status?: string,
    public readonly sortField?: string,
    public readonly sortDirection?: string    
  ) {}
}
