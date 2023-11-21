import { InfluxDB, Point } from '@influxdata/influxdb-client'
import pino from 'pino'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: './.env' })

export interface Data {
  clientId: string
  cpuUsage: number
}

const logger = pino()
const influxDB = new InfluxDB({ url: 'http://localhost:8086', token: process.env.INFLUXDB_TOKEN })

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function storeData (data: Data) {
  const writeApi = influxDB.getWriteApi('file-from-you', 'cpu-metrics')
  const point = new Point('cpu_usage')
    .tag('clientId', data.clientId)
    .floatField('value', data.cpuUsage)
  try {
    writeApi.writePoint(point)
    await writeApi.close()
  } catch (error) {
    logger.error('Failed to write data to InfluxDB:', error)
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function queryData (clientId: string, start: string, stop: string) {
  const queryApi = influxDB.getQueryApi('file-from-you')
  const fluxQuery = `
        from(bucket: "cpu-metrics")
            |> range(start: ${start}, stop: ${stop})
            |> filter(fn: (r) => r["_measurement"] == "cpu_usage")
            |> filter(fn: (r) => r["clientId"] == "${clientId}")
    `
  return await queryApi.collectRows(fluxQuery)
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function queryAllData () {
  const queryApi = influxDB.getQueryApi('file-from-you')
  const fluxQuery = `
        from(bucket: "cpu-metrics")
            |> range(start: -30d)
            |> filter(fn: (r) => r["_measurement"] == "cpu_usage")
    `
  return await queryApi.collectRows(fluxQuery)
}
