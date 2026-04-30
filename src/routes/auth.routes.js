import { Router } from 'express'
import { cadastro, confirmar_codigo, login_usuario, logout_user, pedir_reset_senha } from '../controllers/auth.controller.js'
import { verificarToken } from '../middlewares/logger.middleware.js'

const router = Router()

router.post("/cadastro", cadastro)
router.post("/login", login_usuario)
router.get("/logout", verificarToken, logout_user)
router.post("/login/esqueci-a-senha", pedir_reset_senha)
router.post("/login/esqueci-a-senha-confirmar", confirmar_codigo)

export default router