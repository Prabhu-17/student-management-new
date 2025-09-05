import AuditLog from '../models/AuditLog.js'
import catchAsync from '../utils/catchAsync.js'
import { ok } from '../utils/apiResponse.js'

export const listLogs = catchAsync(async (req, res) => {
  const { page = 1, limit = 20 } = req.query
  const skip = (Number(page) - 1) * Number(limit)

  const [items, total] = await Promise.all([
    AuditLog.find()
      .populate('user', 'email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    AuditLog.countDocuments(),
  ])

  ok(res, {
    items,
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.ceil(total / Number(limit)),
  })
})
