import { Schema, model } from 'mongoose'

const outboxSchema = new Schema({
  eventName: { type: String, required: true },
  payload: { type: Object, required: true },
  occurredOn: { type: Date, required: true },
  processed: { type: Boolean, default: false }
})

export const OutboxModel = model('Outbox', outboxSchema)
