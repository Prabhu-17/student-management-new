import { body } from 'express-validator'

export const registerValidator = [
  body('name').trim().notEmpty(),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['admin', 'teacher']),
]

export const loginValidator = [
  body('email').isEmail(),
  body('password').notEmpty(),
]
