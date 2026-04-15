import { Router } from 'express'
import { cadastro, login_usuario, logout_user } from '../controllers/auth.controller.js'
import { verificarToken } from '../middlewares/logger.middleware.js'

const router = Router()

router.post("/cadastro", cadastro)
router.post("/login", login_usuario)
router.get("/logout", verificarToken, logout_user)

export default router
