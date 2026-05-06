import { Router } from 'express'
import { cadastro_adm } from '../controllers/adm.controller.js'

const router = Router()

router.post("/listar/adm/cadastrar", cadastro_adm)

export default router