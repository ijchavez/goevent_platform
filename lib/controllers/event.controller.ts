// controllers/event.controller.ts
import {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  getAllEvents,
} from '@/lib/actions/event.actions'
import { Request, Response } from 'express'
import { handleError } from '@/lib/utils'

export const createEventController = async (req: Request, res: Response) => {
  try {
    const result = await createEvent(req.body)
    res.json(result)
  } catch (error) {
    handleError(error)
    res.status(500).json({ message: 'Error creating event' })
  }
}

export const getEventByIdController = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const result = await getEventById(id)
    if (!result) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.json(result)
  } catch (error) {
    handleError(error)
    res.status(500).json({ message: 'Error retrieving event' })
  }
}

export const updateEventController = async (req: Request, res: Response) => {
  const { userId, event } = req.body
  const eventId = req.params.id

  if (!userId || !event) {
    return res
      .status(400)
      .json({ error: 'User ID and event data are required.' })
  }

  try {
    const result = await updateEvent({ userId, event, eventId })
    res.json(result)
  } catch (error) {
    handleError(error)
    res.status(500).json({ message: 'Error updating event' })
  }
}

export const deleteEventController = async (req: Request, res: Response) => {
  try {
    await deleteEvent({ eventId: req.params.id, path: '' })
    res.status(204).send()
  } catch (error) {
    handleError(error)
    res.status(500).json({ message: 'Error deleting event' })
  }
}

export const getAllEventsController = async (req: Request, res: Response) => {
  try {
    const result = await getAllEvents({
      query: req.query.query as string,
      category: req.query.category as string,
      limit: parseInt(req.query.limit as string) || 6,
      page: parseInt(req.query.page as string) || 1,
    })
    res.json(result)
  } catch (error) {
    handleError(error)
    res.status(500).json({ message: 'Error retrieving events' })
  }
}
