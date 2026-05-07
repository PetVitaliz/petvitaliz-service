import { Router } from 'express'
import { cadastro_adm, editar_adm, excluir_adm, home_adm, listar_adm, listar_adm_esp, logout_adm } from '../controllers/adm.controller.js'
import { verificarTokenAdmin } from '../middlewares/logger.middleware.js'

const router = Router()

router.get("/", verificarTokenAdmin, home_adm)
router.get("/logout", verificarTokenAdmin, logout_adm)
router.post("/listar/adm/cadastrar", verificarTokenAdmin, cadastro_adm)
router.post("/listar/adm/cadastrar/debug", cadastro_adm)
router.get("/listar/adm", verificarTokenAdmin, listar_adm)
router.get("/listar/adm/:id", verificarTokenAdmin, listar_adm_esp)
router.put("/listar/adm/editar/:id", verificarTokenAdmin, editar_adm)
router.delete("/listar/adm/excluir/:id", verificarTokenAdmin, excluir_adm)

export default router