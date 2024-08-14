import 'dotenv/config' // To read CLERK_API_KEY

import express, { Application, Request, Response } from 'express'
import cors from 'cors'
const port = process.env.PORT || 3001
import {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  getAllEvents,
} from './lib/actions/event.actions'
import { authenticateToken } from './lib/middlewares/authenticateToken'
import { authenticateUser } from './lib/jwtauth'
import { connectToDatabase } from './lib/database'
import { handleError } from './lib/utils'

const app: Application = express()
app.use(cors())
app.use(express.json())

app.post('/api/auth/login', async (req, res) => {
  await connectToDatabase()
  const { clerkId } = req.body

  try {
    const authResult = await authenticateUser(clerkId)

    if (!authResult) {
      return res.status(401).json({ message: 'Authentication failed' })
    }

    const { token } = authResult
    res.json({ token })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
})
// Ruta para obtener un evento por ID
app.get('/api/events/:id', authenticateToken, async (req, res) => {
  const { id } = req.params // Este debería ser el ID del evento
  console.log('Event ID: ', id)

  try {
    const result = await getEventById(id)
    if (!result) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.json(result)
  } catch (error) {
    handleError(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

// Ruta para crear un evento
app.post('/api/events', authenticateToken, async (req, res) => {
  const result = await createEvent(req.body)
  console.log(result)
  res.json(result)
})

// Ruta para actualizar un evento
app.put('/api/events/:id', async (req, res) => {
  const { userId, event } = req.body
  const eventId = req.params.id // Obtén el id del evento desde los parámetros de la URL

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' })
  }

  if (!event) {
    return res.status(400).json({ error: 'Event data is required.' })
  }

  try {
    const result = await updateEvent({ userId, event, eventId })
    res.json(result)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while updating the event.' })
  }
})

// Ruta para eliminar un evento
app.delete('/api/events/:id', async (req, res) => {
  await deleteEvent({ eventId: req.params.id, path: '' })
  res.status(204).send()
})

// Ruta para obtener todos los eventos
app.get('/api/events', async (req, res) => {
  const result = await getAllEvents({
    query: req.query.query as string,
    category: req.query.category as string,
    limit: parseInt(req.query.limit as string) || 6,
    page: parseInt(req.query.page as string) || 1,
  })
  res.json(result)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
