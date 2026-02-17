import mongoose from 'mongoose'

export async function resetDatabase() {
  const collections = mongoose.connection.collections

  for (const key in collections) {
    await collections[key].deleteMany({})
  }
}
