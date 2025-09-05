import { Router } from 'express'
import {
  register,
  login,
  refresh,
  logout,
} from '../controllers/auth.controller.js'
import {
  registerValidator,
  loginValidator,
} from '../validators/auth.validators.js'
import { validationResult } from 'express-validator'

const router = Router()

const handleValidation = (req, res, next) => {
  const result = validationResult(req)
  if (!result.isEmpty())
    return next({
      status: 400,
      message: 'Validation error',
      details: result.array(),
    })
  next()
}

router.post('/register', registerValidator, handleValidation, register)
router.post('/login', loginValidator, handleValidation, login)
router.post('/refresh', refresh)
router.post('/logout', logout)

export default router
