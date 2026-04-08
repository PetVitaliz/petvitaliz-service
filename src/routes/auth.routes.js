import { Router } from 'express'
import { register } from '../controllers/auth.controller.js'

const router = Router()

router.post("/cadastro", register)

export default router
