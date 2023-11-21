/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
import os from 'os'
import { v4 as uuidv4 } from 'uuid'
import amqp, { type Channel, type Connection } from 'amqplib'
import { format } from 'date-fns'

interface ICpuData {
  clientId: string
  timestamp: string
  cpuUsage: number[]
}

const clientId: string = uuidv4() // Generate a unique client ID
let cpuData: number[] = []
let connection: Connection | null = null
let channel: Channel | null = null
let intervalId: NodeJS.Timeout | null = null

export const measureCPUUsage = (): number => {
  const cpuUsage = process.cpuUsage()
  const totalUsage = cpuUsage.user + cpuUsage.system
  return (totalUsage / (os.cpus().length * 1e6)) * 100
}

export const reportData = async (retryInterval: number): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (channel) {
    const message: ICpuData = {
      clientId,
      timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      cpuUsage: cpuData
    }

    try {
      console.info('Publishing messages:', message)
      // Wait for the message to be confirmed
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await channel.sendToQueue('cpu_usage', Buffer.from(JSON.stringify(message)), { persistent: true })
      cpuData = [] // Clear the data after successful reporting
    } catch (error) {
      console.error('Failed to publish message:', error)
      // Retry logic
      setTimeout(async () => { await reportData(retryInterval) }, retryInterval)
    }
  }
}

export const startMeasuring = async (interval: number, retryInterval: number): Promise<void> => {
  try {
    connection = await amqp.connect('amqp://localhost') // Secure AMQP (AMQPS)
    channel = await connection.createChannel()
    await channel.assertQueue('cpu_usage')
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error)
    setTimeout(async () => { await startMeasuring(interval, retryInterval) }, retryInterval)
    return
  }

  intervalId = setInterval(() => {
    const cpuUsage = measureCPUUsage()
    if (cpuUsage > 0) {
      cpuData.push(cpuUsage)
      reportData(retryInterval)
    }
  }, interval)
}

export const stopMeasuring = (): void => {
  if (intervalId != null) {
    clearInterval(intervalId)
    intervalId = null
  }
  if (connection != null) {
    connection.close()
  }
}

startMeasuring(1000, 5000) // Measure CPU usage every second, retry every 5 seconds
