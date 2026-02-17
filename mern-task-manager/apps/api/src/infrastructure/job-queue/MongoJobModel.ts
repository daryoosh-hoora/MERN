import { Schema, model } from 'mongoose'

const jobSchema = new Schema({
  name: { type: String, required: true },
  payload: { 
    type: Schema.Types.Mixed, 
    required: true 
  },
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 3 },
  status: {
    type: String,
    enum: ['pending', 'processing', 'failed', 'completed'],
    default: 'pending'
  }
}, { timestamps: true })

export const MongoJobModel = model('Job', jobSchema)
