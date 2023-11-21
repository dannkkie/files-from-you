import { mocked } from 'ts-jest/utils'
import amqp, { type Channel, type Connection } from 'amqplib'
import os from 'os'
import { startMeasuring, stopMeasuring, measureCPUUsage } from '../src/app' // Assuming the functions are exported

jest.mock('amqplib', () => ({
  connect: jest.fn()
}))

jest.mock('os', () => ({
  cpus: jest.fn()
}))

describe('CPU Monitor', () => {
  let mockConnection: Partial<Connection>
  let mockChannel: Partial<Channel>

  beforeEach(() => {
    jest.useFakeTimers()

    mockChannel = {
      assertQueue: jest.fn(),
      sendToQueue: jest.fn()
    }

    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
      close: jest.fn()
    }

    mocked(amqp.connect).mockResolvedValue(mockConnection as Connection)
    mocked(os.cpus).mockReturnValue(new Array(4))
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('should start measuring CPU usage', async () => {
    await startMeasuring(1000, 5000)

    expect(amqp.connect).toHaveBeenCalledWith('amqp://localhost')
    expect(mockConnection.createChannel).toHaveBeenCalled()
    expect(mockChannel.assertQueue).toHaveBeenCalledWith('cpu_usage')

    jest.advanceTimersByTime(1000)

    expect(setInterval).toHaveBeenCalled()
  })

  it('should stop measuring CPU usage', async () => {
    await startMeasuring(1000, 5000)
    stopMeasuring()

    expect(clearInterval).toHaveBeenCalled()
    expect(mockConnection.close).toHaveBeenCalled()
  })

  it('should measure CPU usage', () => {
    const cpuUsage = measureCPUUsage()

    expect(cpuUsage).toBeGreaterThanOrEqual(0)
    expect(os.cpus).toHaveBeenCalled()
  })

  it('should report data', async () => {
    await startMeasuring(1000, 5000)

    jest.advanceTimersByTime(1000)

    expect(mockChannel.sendToQueue).toHaveBeenCalled()
  })
})
