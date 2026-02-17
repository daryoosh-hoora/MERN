import dotenv from 'dotenv'

dotenv.config()

export const env = {
  port: Number(process.env.API_PORT) || 4000,

  mongoUri: process.env.MONGO_URI!,
  testDB: process.env.TEST_DB!,
  redisUrl: process.env.REDIS_URL!
}
