import { Request, Response } from 'express'
import {
  checkoutOrder as checkoutOrderAction,
  createOrder as createOrderAction,
  getOrdersByEvent as getOrdersByEventAction,
  getOrdersByUser as getOrdersByUserAction,
} from '@/lib/actions/order.actions'

export const createNewOrder = async (req: Request, res: Response) => {
  try {
    const order = await createOrderAction(req.body)
    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la orden', error })
  }
}

export const processCheckoutOrder = async (req: Request, res: Response) => {
  try {
    const checkout = await checkoutOrderAction(req.body, req)
    console.log(checkout)
    res.status(200).json({ checkout })
  } catch (error) {
    res.status(500).json({ message: 'Error en el checkout', error })
  }
}

export const fetchOrdersByEvent = async (req: Request, res: Response) => {
  try {
    const orders = await getOrdersByEventAction({
      eventId: req.params.eventId,
      searchString: req.query.searchString as string,
    })
    res.status(200).json(orders)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener órdenes del evento', error })
  }
}

export const fetchOrdersByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const { limit, page } = req.query
    const orders = await getOrdersByUserAction({
      userId,
      limit: Number(limit),
      page: Number(page),
    })
    res.status(200).json(orders)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener órdenes del usuario', error })
  }
}
