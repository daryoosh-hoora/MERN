import { env } from './config/env'
import { createRedisClient } from './cache/redis'
import { connectMongo, disconnectMongo } from './db/mongo'
import { MongoUserRepository } from './db/repositories/MongoUserRepository'

export async function initInfrastructure() {
  await connectMongo(env.mongoUri)

  return {
    redis: createRedisClient(env.redisUrl),
    userRepository: new MongoUserRepository()
  }
}

export async function shutdownInfrastructure() {
  await disconnectMongo()

  // if (redis.status === 'ready') {
  //   await redis.quit()
  // }
}
