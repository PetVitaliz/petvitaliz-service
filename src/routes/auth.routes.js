import { Router } from 'express'
import { cadastro, confirmar_codigo, login_adm, login_funcionario, login_usuario, logout, pedir_reset_senha, reset_senha } from '../controllers/auth.controller.js'
import { verificarToken, verificarTokenReset } from '../middlewares/logger.middleware.js'

const router = Router()

router.post("/cadastro", cadastro)
router.post("/login", login_usuario)
router.post("/login/adm", login_adm)
router.post("login/funcionario", login_funcionario)
router.get("/logout", verificarToken, logout)
router.post("/login/esqueci-a-senha", pedir_reset_senha)
router.post("/login/esqueci-a-senha-confirmar", confirmar_codigo)
router.put("/login/alterar-senha", verificarTokenReset, reset_senha)

export default router