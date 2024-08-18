// routes/event.routes.ts
import express from 'express'
import { obtainToken } from '../controllers/user.controller'
const router = express.Router()

router.post('/login', obtainToken)

export default router
