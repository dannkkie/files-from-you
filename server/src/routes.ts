/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Request, type Response, Router } from 'express'
import { queryData, queryAllData } from './database'

const router = Router()

router.get('/data', async (req: Request, res: Response) => {
  const clientId = req.query.clientId as string
  const start = req.query.start as string
  const stop = req.query.stop as string
  const data = await queryData(clientId, start, stop)
  res.json(data)
})

router.get('/allData', async (req: Request, res: Response) => {
  const data = await queryAllData()
  res.json(data)
})

export default router
