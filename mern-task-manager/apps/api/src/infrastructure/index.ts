import { connectMongo, disconnectMongo } from './db/mongo'
import { createRedisClient } from './cache/redis'
import { MongoUserRepository } from './repositories/MongoUserRepository'
import { env } from '../config/env'

export async function initInfrastructure() {
  await connectMongo(env.mongoUri)

  const redis = createRedisClient(env.redisUrl)
  const userRepository = new MongoUserRepository()

  return {
    redis,
    userRepository
  }
}

export async function shutdownInfrastructure() {
  await disconnectMongo()

  // if (redis.status === 'ready') {
  //   await redis.quit()
  // }
}
