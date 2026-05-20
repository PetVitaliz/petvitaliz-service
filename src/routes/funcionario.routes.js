import { Router } from 'express'
import { atualizar_consulta, detalhes_consulta, home_funcionario, listar_consultas, logout_funcionario } from '../controllers/funcionario.controller.js'
import { verificarTokenFuncionario } from '../middlewares/logger.middleware.js'

const router = Router()

router.get("", verificarTokenFuncionario, home_funcionario)
router.get("/logout", verificarTokenFuncionario, logout_funcionario)
router.get("/consultas", verificarTokenFuncionario, listar_consultas)
router.get("/consultas/:id", verificarTokenFuncionario, detalhes_consulta)
router.put("/consultas/atualizar/:id", verificarTokenFuncionario, atualizar_consulta)

export default router