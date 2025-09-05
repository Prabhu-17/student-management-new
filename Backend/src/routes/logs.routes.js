import { Router } from 'express'
import { auth } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/roles.js'
import { listLogs } from '../controllers/logs.controller.js'

const router = Router()
router.get('/', auth, requireRole('admin'), listLogs)
export default router
