import { body, query } from 'express-validator'

// ✅ Create Student
export const createStudentValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('className').trim().notEmpty().withMessage('Class name is required'),
  body('gender')
    .isIn(['Male', 'Female', 'Other','male','female'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Invalid date of birth'),
  body('address').trim().notEmpty().withMessage('Address is required'),
]

// ✅ Update Student
export const updateStudentValidator = [
  body('name').optional().trim().notEmpty(),
  body('className').optional().trim().notEmpty(),
  body('gender').optional().isIn(['Male', 'Female', 'Other','male','female']),
  body('email').optional().isEmail(),
  body('phone').optional().trim().notEmpty(),
  body('dateOfBirth').optional().isISO8601().toDate(),
  body('address').optional().trim().notEmpty(),
]

// ✅ List Students (query params)
export const listStudentQueryValidator = [
  query('page').optional().toInt().isInt({ min: 1 }),
  query('limit').optional().toInt().isInt({ min: 1, max: 100 }),
  query('search').optional().trim(),
  query('className').optional().trim(),
  query('gender').optional().isIn(['Male', 'Female', 'Other','male','female']),
]
