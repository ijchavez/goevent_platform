import jwt from 'jsonwebtoken'
import { getUserByClerkId } from './actions/user.actions'
import { handleError } from './utils'

export async function authenticateUser(clerkId: string) {
  try {
    const user = await getUserByClerkId(clerkId)

    if (!user) {
      throw new Error('User not found')
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    })
    return { token }
  } catch (error) {
    handleError(error)
  }
}
