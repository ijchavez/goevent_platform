import { Router } from 'express'
import {
  createNewOrder,
  processCheckoutOrder,
  fetchOrdersByEvent,
  fetchOrdersByUser,
} from '../controllers/order.controller'

const router = Router()

router.post('/', createNewOrder)
router.post('/checkout', processCheckoutOrder)
router.get('/events/:eventId', fetchOrdersByEvent)
router.get('/user/:userId', fetchOrdersByUser)

export default router
