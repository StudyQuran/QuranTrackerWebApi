import redis from 'redis'
import Config from '..'

const RedisConection = redis.createClient({
  url: Config.Env.DataBase.REDIS_URI,
  no_ready_check: true,
  auth_pass: Config.Env.DataBase.REDIS_PASSWORD
})

RedisConection.on('connect', () => {
  console.log('Redis Connected')
})

RedisConection.on('ready', () => {
  console.log('Redis Connected and ready to use')
})

RedisConection.on('error', (err) => {
  console.log(err.message)
})

RedisConection.on('end', () => {
  console.log('Client disconnected from redis')
})

process.on('SIGINT', () => {
  RedisConection.quit()
})

export default RedisConection
