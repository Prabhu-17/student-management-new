import { Router } from 'express'
import { body, query, validationResult } from 'express-validator'
import { auth } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/roles.js'
import { upload } from '../middlewares/upload.js'
import { audit } from '../middlewares/audit.js'
import {
  createStudent,
  listStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/student.controller.js'
import { importStudentsXlsx, exportStudentsXlsx } from '../utils/excel.js'
import catchAsync from '../utils/catchAsync.js'
import { ok } from '../utils/apiResponse.js'

const router = Router()

// ✅ Reusable validation middleware
const validate = (validators) => [
  ...validators,
  (req, res, next) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: result.array(), // send actual field errors
      })
    }
    next()
  },
]

// ✅ Inline Validators
const createStudentValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('className').notEmpty().withMessage('Class name is required'),
  body('gender')
    .isIn(['Male', 'Female', 'Other', 'male', 'female', 'other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('dateOfBirth').optional().isISO8601().toDate(),
  body('address').notEmpty().withMessage('Address is required'),
]

const updateStudentValidator = [
  body('name').optional().notEmpty(),
  body('email').optional().isEmail(),
  body('phone').optional().notEmpty(),
  body('className').optional().notEmpty(),
  body('gender').optional().isIn(['Male', 'Female', 'Other','male','female']),
  body('dateOfBirth').optional().isISO8601().toDate(),
  body('address').optional().notEmpty(),
]

const listStudentQueryValidator = [
  query('className').optional().isString(),
  query('gender').optional().isIn(['Male', 'Female', 'Other']),
]

// ======================== ROUTES ========================

// List & Get
router.get('/', auth, validate(listStudentQueryValidator), listStudents)
router.get('/:id', auth, getStudent)

// Create
router.post(
  '/',
  auth,
  requireRole('admin'),
  upload.single('profilePhoto'),
  validate(createStudentValidator),
  audit('CREATE'),
  createStudent
)

// Update
router.put(
  '/:id',
  auth,
  requireRole('admin'),
  upload.single('profilePhoto'),
  validate(updateStudentValidator),
  audit('UPDATE'),
  updateStudent
)

// Delete
router.delete(
  '/:id',
  auth,
  requireRole('admin'),
  audit('DELETE'),
  deleteStudent
)

// Export Excel
router.get(
  '/export/xlsx/all',
  auth,
  requireRole('admin'),
  catchAsync(async (req, res) => {
    const buf = await exportStudentsXlsx()
    res.setHeader('Content-Disposition', 'attachment; filename="students.xlsx"')
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.send(buf)
  })
)

// Import Excel
router.post(
  '/import/xlsx',
  auth,
  requireRole('admin'),
  upload.single('file'),
  catchAsync(async (req, res, next) => {
    if (!req.file) return next({ status: 400, message: 'File required' })
    const results = await importStudentsXlsx(req.file.buffer ?? Buffer.from(''))
    ok(res, results, 'Import complete')
  })
)

export default router
