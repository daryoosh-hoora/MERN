import { Task } from '@/domain/task/Task'
import { randomUUID } from 'crypto'

describe('Task Entity', () => {

  it('should create task with valid data', () => {
    const task = Task.create({
      title: 'Test task',
      description: 'Test description',
      ownerId: randomUUID(),
    })

    expect(task.title).toBe('Test task')
  })

  it('should throw if title empty', () => {
    expect(() => {
      Task.create({
        title: '',
        description: 'Test description',
        ownerId: randomUUID(),
      })
    }).toThrow()
  })
})
