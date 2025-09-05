import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import User from '../models/User.js'
import RefreshToken from '../models/RefreshToken.js'
import catchAsync from '../utils/catchAsync.js'
import { ok, created } from '../utils/apiResponse.js'

const signAccess = (user) =>
  jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m',
  })

const signRefresh = (user) =>
  jwt.sign({ sub: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d',
  })

export const register = catchAsync(async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return next({
      status: 400,
      message: 'Validation error',
      details: errors.array(),
    })

  const { name, email, password, role } = req.body
  const exists = await User.findOne({ email })
  if (exists) return next({ status: 409, message: 'Email already registered' })

  const user = await User.create({ name, email, password, role })
  created(
    res,
    { id: user._id, email: user.email, role: user.role },
    'User registered'
  )
})

export const login = catchAsync(async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return next({
      status: 400,
      message: 'Validation error',
      details: errors.array(),
    })

  const { email, password } = req.body
  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password)))
    return next({ status: 401, message: 'Invalid credentials' })

  const accessToken = signAccess(user)
  const refreshToken = signRefresh(user)
  const payload = jwt.decode(refreshToken)
  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt: new Date(payload.exp * 1000),
  })

  ok(
    res,
    {
      accessToken,
      refreshToken,
      user: { id: user._id, email: user.email, role: user.role },
    },
    'Logged in'
  )
})

export const refresh = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body
  if (!refreshToken)
    return next({ status: 400, message: 'Refresh token required' })

  const stored = await RefreshToken.findOne({ token: refreshToken })
  if (!stored) return next({ status: 401, message: 'Invalid refresh token' })

  let payload
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
  } catch {
    return next({ status: 401, message: 'Expired refresh token' })
  }

  const user = await User.findById(payload.sub)
  if (!user) return next({ status: 401, message: 'User not found' })

  const accessToken = signAccess(user)
  ok(res, { accessToken }, 'Token refreshed')
})

export const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body
  if (refreshToken) await RefreshToken.deleteOne({ token: refreshToken })
  ok(res, null, 'Logged out')
})
