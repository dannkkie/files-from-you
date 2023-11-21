import request from 'supertest'
import { startServer } from '../src/server'

describe('Server', () => {
  let server: any

  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    server = await startServer(3000)
  })

  afterAll(async () => {
    await server.close()
  })

  test('/data route should return data', async () => {
    const response = await request(server).get('/data?clientId=test&start=2022-01-01T00:00:00Z&stop=2022-12-31T23:59:59Z')
    expect(response.statusCode).toBe(200)
    expect(response.body).toBeDefined()
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0].clientId).toBe('test')
  })

  test('/allData route should return all data', async () => {
    const response = await request(server).get('/allData')
    expect(response.statusCode).toBe(200)
    expect(response.body).toBeDefined()
    expect(response.body.length).toBeGreaterThan(0)
  })
})
