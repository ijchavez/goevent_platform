// controllers/event.controller.ts
import { authenticateUser } from '../jwtauth'

export const obtainToken = async (req: any, res: any) => {
  try {
    const { clerkId } = req.body
    const authResult = await authenticateUser(clerkId)

    if (!authResult) {
      return res.status(401).json({ message: 'Authentication failed' })
    }

    const { token } = authResult
    res.json({ token })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
