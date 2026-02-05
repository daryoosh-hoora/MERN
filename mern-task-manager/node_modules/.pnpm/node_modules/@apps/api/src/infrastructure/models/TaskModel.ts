import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ['do', 'doing', 'done'],
    required: true
  },
  ownerId: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

export const TaskModel = mongoose.model('Task', taskSchema)
