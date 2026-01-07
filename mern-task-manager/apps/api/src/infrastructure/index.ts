import { connectMongo } from './db/mongo.js'
import { createRedisClient } from './cache/redis.js'
import { MongoUserRepository } from './repositories/MongoUserRepository.js'
import { env } from '../config/env.js'

export async function initInfrastructure() {
  await connectMongo(env.mongoUri)

  const redis = createRedisClient(env.redisUrl)
  const userRepository = new MongoUserRepository()

  return {
    redis,
    userRepository
  }
}
