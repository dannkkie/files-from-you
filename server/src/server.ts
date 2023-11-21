/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import express from 'express'
import amqp, { type Channel, type ConsumeMessage } from 'amqplib'
import pino from 'pino'
import cors from 'cors'
import { type Data, storeData } from './database'
import router from './routes'

const logger = pino()
const app = express()
app.use(cors())
app.use('/', router)

let channel: Channel | null = null

export async function startServer (port: number) {
  try {
    const connection = await amqp.connect('amqp://localhost')
    channel = await connection.createChannel()
    await channel.assertQueue('cpu_usage')
  } catch (error) {
    logger.error('Failed to connect to RabbitMQ:', error)
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => { await startServer(port) }, 5000)
    return
  }

  channel.consume('cpu_usage', (msg: ConsumeMessage | null) => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (msg) {
      const data: Data = JSON.parse(msg.content.toString())
      console.log('Received data:', data)
      storeData(data)
    }
  }, { noAck: true })

  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`)
  })

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

function shutdown () {
  logger.info('Shutting down...')
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (channel) {
    channel.close()
  }
  process.exit(0)
}

startServer(3000)
