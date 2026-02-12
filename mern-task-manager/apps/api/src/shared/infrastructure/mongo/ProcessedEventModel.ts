import { Schema, model } from 'mongoose'

const processedEventSchema = new Schema({
  eventId: { type: String, required: true, unique: true },
  eventName: { type: String, required: true },
  processedAt: { type: Date, default: Date.now }
})

export const ProcessedEventModel =
  model('ProcessedEvent', processedEventSchema)
