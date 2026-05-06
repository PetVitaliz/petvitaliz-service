import { Router } from 'express'
import { cadastro_adm, home_adm, logout_adm } from '../controllers/adm.controller.js'
import { verificarTokenAdmin } from '../middlewares/logger.middleware.js'

const router = Router()

router.get("/", verificarTokenAdmin, home_adm)
router.get("/logout", verificarTokenAdmin, logout_adm)
router.post("/listar/adm/cadastrar", verificarTokenAdmin, cadastro_adm)
router.post("/listar/adm/cadastrar/debug", cadastro_adm)

export default router