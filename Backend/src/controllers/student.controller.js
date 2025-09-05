// controllers/student.controller.js
import { validationResult } from 'express-validator'
import Student from '../models/Student.js'
import catchAsync from '../utils/catchAsync.js'
import { ok, created } from '../utils/apiResponse.js'

// ✅ Create Student
export const createStudent = catchAsync(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array(),
    })
  }

  const payload = { ...req.body }
  if (req.file) {
    payload.profilePhotoUrl = `/${req.file.path.replace(/\\/g, '/')}`
  }

  const doc = await Student.create(payload)

  req.audit = { entityId: doc._id, before: null, after: doc.toObject() }
  return created(res, doc, 'Student created successfully')
})

// ✅ List Students with filters + pagination
export const listStudents = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, search = '', className, gender } = req.query

  const filter = {}
  if (search) filter.name = { $regex: search, $options: 'i' }
  if (className && className !== 'all') filter.className = className
  if (gender) filter.gender = gender

  const skip = (Number(page) - 1) * Number(limit)

  const [items, total] = await Promise.all([
    Student.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Student.countDocuments(filter),
  ])

  return ok(res, {
    items,
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.ceil(total / Number(limit)),
  })
})

// ✅ Get Student by ID
export const getStudent = catchAsync(async (req, res) => {
  const doc = await Student.findById(req.params.id)
  if (!doc) {
    return res.status(404).json({
      success: false,
      message: 'Student not found',
    })
  }
  return ok(res, doc)
})

// ✅ Update Student
export const updateStudent = catchAsync(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array(),
    })
  }

  const before = await Student.findById(req.params.id).lean()
  if (!before) {
    return res.status(404).json({
      success: false,
      message: 'Student not found',
    })
  }

  const updates = { ...req.body }
  if (req.file) {
    updates.profilePhotoUrl = `/${req.file.path.replace(/\\/g, '/')}`
  }

  const doc = await Student.findByIdAndUpdate(req.params.id, updates, {
    new: true,
  })

  req.audit = { entityId: doc._id, before, after: doc.toObject() }
  return ok(res, doc, 'Student updated successfully')
})

// ✅ Delete Student
export const deleteStudent = catchAsync(async (req, res) => {
  const before = await Student.findById(req.params.id).lean()
  if (!before) {
    return res.status(404).json({
      success: false,
      message: 'Student not found',
    })
  }

  await Student.findByIdAndDelete(req.params.id)

  req.audit = { entityId: req.params.id, before, after: null }
  return ok(res, null, 'Student deleted successfully')
})
