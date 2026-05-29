import Redis from 'ioredis'

export function createRedisClient(url: string) {
  const client = new Redis(url)

  if (client.status === 'end') {
    client.on('connect', () => {
      console.log('🟢 Redis connected')
    })

    client.on('error', (err) => {
      console.error('🔴 Redis error', err)
    })
  }

  return client
}
