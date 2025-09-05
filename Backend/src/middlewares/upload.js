import multer from 'multer'
import path from 'path'
import fs from 'fs'

const dir = 'uploads'
if (!fs.existsSync(dir)) fs.mkdirSync(dir)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/') // Make sure /uploads exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const fileFilter = (req, file, cb) => {
  if (/image\/(png|jpeg|jpg|webp)/.test(file.mimetype)) cb(null, true)
  else cb(new Error('Only image uploads are allowed'), false)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}) // 2MB
