import { Router } from 'express'
import { agendamento_n_logada, cadastrar_pet, cadastrar_pet_n_logada, contato, contato_n_logada, editar_pet, editar_pet_n_logada, excluir_pet, excluir_pet_n_logada, home, home_n_logada, listar_pet, listar_pet_n_logada, servicos, servicos_emergencia, servicos_emergencia_n_logada, servicos_n_logado } from '../controllers/home.controller.js'
import { verificarToken } from '../middlewares/logger.middleware.js'


const router = Router()

router.get("/", home_n_logada)
router.get("/user/home", verificarToken, home)
router.get("/servicos", servicos_n_logado)
router.get("/user/servicos", verificarToken, servicos)
router.get("/contato", contato_n_logada)
router.post("/user/contato", verificarToken, contato)
router.get("/servicos-de-emergencia", servicos_emergencia_n_logada)
router.get("/user/servicos-de-emergencia", verificarToken, servicos_emergencia)
router.get("/cadastrar/pet", cadastrar_pet_n_logada)
router.post("/user/cadastrar/pet", verificarToken, cadastrar_pet)
router.get("/listar/pet", listar_pet_n_logada)
router.get("/user/listar/pet", verificarToken, listar_pet)
router.get("/editar/pet/:id", editar_pet_n_logada)
router.put("/user/editar/pet/:id", verificarToken, editar_pet)
router.get("/delete/pet/:id", excluir_pet_n_logada)
router.delete("/user/delete/pet/:id", verificarToken, excluir_pet)
router.get("/agendamento", agendamento_n_logada)

export default router
