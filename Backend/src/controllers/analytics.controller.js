import Student from '../models/Student.js'
import catchAsync from '../utils/catchAsync.js'
import { ok } from '../utils/apiResponse.js'

export const getAnalytics = catchAsync(async (req, res) => {
  const total = await Student.countDocuments()

  const perClass = await Student.aggregate([
    { $group: { _id: '$className', count: { $sum: 1 } } },
    { $project: { className: '$_id', count: 1, _id: 0 } },
    { $sort: { className: 1 } },
  ])

  const genderRatio = await Student.aggregate([
    { $group: { _id: '$gender', count: { $sum: 1 } } },
    { $project: { gender: '$_id', count: 1, _id: 0 } },
  ])

  ok(res, { total, perClass, genderRatio })
})
