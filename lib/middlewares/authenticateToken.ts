import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

interface AuthenticatedRequest extends Request {
  user?: any // Puedes tipar esto mejor según tus necesidades
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.sendStatus(401) // No autorizado
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      return res.sendStatus(403) // Prohibido
    }
    req.user = user // Asigna la información del usuario a req.user
    next()
  })
}
