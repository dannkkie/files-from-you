/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { storeData, queryData, queryAllData } from '../src/database'

describe('Data module', () => {
  test('storeData should store data', async () => {
    const data = { clientId: 'test', cpuUsage: 50 }
    const result = await storeData(data)

    expect(result).toBe(true)
  })

  test('queryData should query data', async () => {
    const data = await queryData('test', '2022-01-01T00:00:00Z', '2022-12-31T23:59:59Z')
    // Here you would normally have assertions to check if the data was queried correctly
    // For example:
    expect(data).toBeDefined()
    expect(data.length).toBeGreaterThan(0)
    expect(data[0].clientId).toBe('test')
  })

  test('queryAllData should query all data', async () => {
    const data = await queryAllData()
    // Here you would normally have assertions to check if all data was queried correctly
    // For example:
    expect(data).toBeDefined()
    expect(data.length).toBeGreaterThan(0)
  })
})
