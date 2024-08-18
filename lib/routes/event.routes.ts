// routes/event.routes.ts
import express from 'express'
import { authenticateToken } from '@/lib/middlewares/authenticateToken'
import {
  createEventController,
  getEventByIdController,
  updateEventController,
  deleteEventController,
  getAllEventsController,
} from '../controllers/event.controller'

const router = express.Router()

router.get('/:id', authenticateToken, getEventByIdController)
router.post('/', authenticateToken, createEventController)
router.put('/:id', updateEventController)
router.delete('/:id', deleteEventController)
router.get('/', getAllEventsController)

export default router
