import mongoose from 'mongoose'
import { Router } from 'express'

export const healthRouter = Router()

healthRouter.get('/', (_req, res) => {
  const mongoState = mongoose.connection.readyState

  res.status(200).json({
    status: 'ok',
    mongo: mongoState === 1 ? 'connected' : 'disconnected'
  })
})
