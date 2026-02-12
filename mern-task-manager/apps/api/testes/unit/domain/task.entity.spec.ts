import { Task } from '@/src/domain/Task.js'

describe('Task Entity', () => {

  it('should create task with valid data', () => {
    const task = Task.create({
      title: 'Test task'
    })

    expect(task.title).toBe('Test task')
  })

  it('should throw if title empty', () => {
    expect(() => {
      Task.create({ title: '' })
    }).toThrow()
  })

})
