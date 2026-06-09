import { Router } from 'express'
import { atualizar_consulta, atualizar_perfil_funcionario, bater_ponto, detalhes_consulta, home_funcionario, listar_clientes_funcionario, listar_consultas, listar_todos_pets_funcionario, logout_funcionario, obter_perfil_funcionario } from '../controllers/funcionario.controller.js'
import { verificarTokenFuncionario } from '../middlewares/logger.middleware.js'

const router = Router()

router.get("", verificarTokenFuncionario, home_funcionario)
router.get("/logout", verificarTokenFuncionario, logout_funcionario)
router.get("/consultas", verificarTokenFuncionario, listar_consultas)
router.get("/consultas/:id", verificarTokenFuncionario, detalhes_consulta)
router.put("/consultas/atualizar/:id", verificarTokenFuncionario, atualizar_consulta)
router.post("/bater-ponto", verificarTokenFuncionario, bater_ponto);
router.get('/perfil-dados', verificarTokenFuncionario, obter_perfil_funcionario)
router.put('/perfil-dados/atualizar', verificarTokenFuncionario, atualizar_perfil_funcionario);
router.get("/clientes", verificarTokenFuncionario, listar_clientes_funcionario);
router.get("/pets", verificarTokenFuncionario, listar_todos_pets_funcionario)

export default router