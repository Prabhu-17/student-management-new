import { Router } from 'express'
import { auth } from '../middlewares/auth.js'
import { getAnalytics } from '../controllers/analytics.controller.js'

const router = Router()
router.get('/', auth, getAnalytics)
export default router
