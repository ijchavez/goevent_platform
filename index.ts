import 'dotenv/config'
import express, { Application } from 'express'
import cors from 'cors'
import eventRoutes from './lib/routes/event.routes'
import userRoutes from './lib/routes/user.routes'
import { connectToDatabase } from './lib/database'
import categoryRoutes from './lib/routes/category.routes'
import orderRoutes from './lib/routes/order.routes'

const app: Application = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/events', eventRoutes)
app.use('/api/auth', userRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/orders', orderRoutes)

app.listen(port, () => {
  connectToDatabase()
  console.log(`Server running at http://localhost:${port}`)
})
