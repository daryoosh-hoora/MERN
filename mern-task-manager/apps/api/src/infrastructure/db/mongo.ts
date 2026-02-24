import mongoose from 'mongoose'
import { env } from '@/infrastructure/config/env'

export async function connectMongo(uri: string) {
  mongoose.set('strictQuery', true)

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(env.mongoUri)
  }

  console.log('🟢 MongoDB connected')
}

export async function disconnectMongo() {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
    }
  } catch {
    // ignore if already closed
  }

  console.log('🔴 MongoDB disconnected')
}
