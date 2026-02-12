import { Router } from 'express'
import mongoose from 'mongoose'

export const healthRouter = Router()

healthRouter.get('/', (_req, res) => {
  const mongoState = mongoose.connection.readyState

  res.status(200).json({
    status: 'ok',
    mongo: mongoState === 1 ? 'connected' : 'disconnected'
  })
})
