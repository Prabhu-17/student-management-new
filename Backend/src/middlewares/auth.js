import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const auth = async (req, res, next) => {
  try {
    const hdr = req.headers.authorization || ''
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null
    if (!token) return next({ status: 401, message: 'No token provided' })

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    const user = await User.findById(payload.sub)
    if (!user) return next({ status: 401, message: 'User not found' })

    req.user = { id: user._id, role: user.role, email: user.email }
    next()
  } catch (e) {
    next({ status: 401, message: 'Invalid or expired token' })
  }
}
