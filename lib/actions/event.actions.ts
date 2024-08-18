'use server'

import { revalidatePath } from 'next/cache'

import { connectToDatabase } from '@/lib/database'
import Event from '@/lib/database/models/event.model'
import User from '@/lib/database/models/user.model'
import Category from '@/lib/database/models/category.model'
import { handleError } from '@/lib/utils'

import {
  CreateEventParams,
  UpdateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
} from '@/types'

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: 'i' } })
}

const populateEvent = (query: any) => {
  return query
    .populate({
      path: 'organizer',
      model: User,
      select: '_id firstName lastName',
    })
    .populate({ path: 'category', model: Category, select: '_id name' })
}

// CREATE
export async function createEvent({ userId, event, path }: CreateEventParams) {
  try {
    await connectToDatabase()

    const organizer = await User.findById(userId)
    if (!organizer) throw new Error('Organizer not found')

    const newEvent = await Event.create({
      ...event,
      category: event.categoryId,
      organizer: userId,
    })
    if (typeof revalidatePath === 'function' && path) {
      revalidatePath(path)
    }

    return JSON.parse(JSON.stringify(newEvent))
  } catch (error) {
    handleError(error)
  }
}

// GET ONE EVENT BY ID
export async function getEventById(eventId: string) {
  try {
    await connectToDatabase()

    const event = await populateEvent(Event.findById(eventId))

    if (!event) {
      const error = new Error('Event not found')
      error.name = 'NotFoundError'
      throw error
    }

    return JSON.parse(JSON.stringify(event))
  } catch (error) {
    // Verificamos que el error sea un Error de JavaScript
    if (error instanceof Error) {
      if (error.name === 'NotFoundError') {
        if (typeof window === 'undefined') {
          // Estamos en el backend
          return null
        } else {
          // Estamos en el frontend
          alert('Event not found')
        }
      } else {
        handleError(error)
      }
    } else {
      console.error('Unknown error', error)
    }
  }
}

// UPDATE
export async function updateEvent({
  userId,
  event,
  eventId,
  path,
}: {
  userId: string
  event: any
  eventId: string
  path?: string
}) {
  try {
    await connectToDatabase()

    let eventToUpdate
    const filter = path ? event._id : eventId

    eventToUpdate = await Event.findById(filter)

    // Verifica si el evento existe y si el usuario es el organizador
    if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error('Unauthorized or event not found')
    }

    // Actualiza el evento
    const updatedEvent = await Event.findByIdAndUpdate(
      filter,
      { ...event, category: event.categoryId },
      { new: true },
    )

    // Revalida la ruta si es necesario
    if (typeof revalidatePath === 'function' && path) {
      revalidatePath(path)
    }

    return JSON.parse(JSON.stringify(updatedEvent))
  } catch (error) {
    handleError(error)
  }
}

// DELETE
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    await connectToDatabase()

    const deletedEvent = await Event.findByIdAndDelete(eventId)
    if (typeof revalidatePath === 'function' && path) {
      if (deletedEvent) revalidatePath(path)
    }
  } catch (error) {
    handleError(error)
  }
}

// GET ALL EVENTS
export async function getAllEvents({
  query,
  limit = 6,
  page,
  category,
}: GetAllEventsParams) {
  try {
    await connectToDatabase()

    const titleCondition = query
      ? { title: { $regex: query, $options: 'i' } }
      : {}
    const categoryCondition = category
      ? await getCategoryByName(category)
      : null
    const conditions = {
      $and: [
        titleCondition,
        categoryCondition ? { category: categoryCondition._id } : {},
      ],
    }

    const skipAmount = (Number(page) - 1) * limit
    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    }
  } catch (error) {
    handleError(error)
  }
}

// GET EVENTS BY ORGANIZER
export async function getEventsByUser({
  userId,
  limit = 6,
  page,
}: GetEventsByUserParams) {
  try {
    await connectToDatabase()

    const conditions = { organizer: userId }
    const skipAmount = (page - 1) * limit

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    }
  } catch (error) {
    handleError(error)
  }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    await connectToDatabase()

    const skipAmount = (Number(page) - 1) * limit
    const conditions = {
      $and: [{ category: categoryId }, { _id: { $ne: eventId } }],
    }

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    }
  } catch (error) {
    handleError(error)
  }
}
