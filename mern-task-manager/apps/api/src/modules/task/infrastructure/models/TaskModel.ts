import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    required: true
  },
  ownerId: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null }
})

export const TaskModel = mongoose.model('Task', taskSchema)
