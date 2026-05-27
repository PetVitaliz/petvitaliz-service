import { Router } from 'express'
import { agendamento, agendamento_n_logada, cadastrar_pet, cadastrar_pet_n_logada, cancelar_plano, consultas, consultas_n_logado, contato, contato_n_logada, editar_pet, editar_pet_n_logada, excluir_pet, excluir_pet_n_logada, home, home_n_logada, listar_pet, listar_pet_n_logada, pagamento, planos, servicos, servicos_emergencia, servicos_emergencia_n_logada, servicos_n_logado } from '../controllers/home.controller.js'

import { verificarToken } from '../middlewares/logger.middleware.js'

const router = Router()

/**
 * @swagger
 * /:
 *   get:
 *     summary: Acessa a página inicial pública
 *     tags: [Home]
 */
router.get("", home_n_logada)


/**
 * @swagger
 * /user/home:
 *   get:
 *     summary: Acessa a página inicial do usuário autenticado
 *     tags: [Home]
 */
router.get("/user/home", verificarToken, home)


/**
 * @swagger
 * /servicos:
 *   get:
 *     summary: Lista os serviços disponíveis publicamente
 *     tags: [Serviços]
 */
router.get("/servicos", servicos_n_logado)


/**
 * @swagger
 * /user/servicos:
 *   get:
 *     summary: Lista os serviços para usuário autenticado
 *     tags: [Serviços]
 */
router.get("/user/servicos", verificarToken, servicos)


/**
 * @swagger
 * /contato:
 *   get:
 *     summary: Exibe informações de contato públicas
 *     tags: [Contato]
 */
router.get("/contato", contato_n_logada)


/**
 * @swagger
 * /user/contato:
 *   post:
 *     summary: Envia mensagem de contato autenticado
 *     tags: [Contato]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               mensagem:
 *                 type: string
 */
router.post("/user/contato", verificarToken, contato)


/**
 * @swagger
 * /servicos-de-emergencia:
 *   get:
 *     summary: Lista serviços de emergência publicamente
 *     tags: [Serviços]
 */
router.get("/servicos-de-emergencia", servicos_emergencia_n_logada)


/**
 * @swagger
 * /user/servicos-de-emergencia:
 *   get:
 *     summary: Lista serviços de emergência para usuário autenticado
 *     tags: [Serviços]
 */
router.get("/user/servicos-de-emergencia", verificarToken, servicos_emergencia)


/**
 * @swagger
 * /cadastar/pet:
 *   get:
 *     summary: Exibe página de cadastro de pet
 *     tags: [Pets]
 */
router.get("/cadastar/pet", cadastrar_pet_n_logada)


/**
 * @swagger
 * /user/cadastar/pet:
 *   post:
 *     summary: Cadastra um novo pet
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               especie:
 *                 type: string
 *               sexo:
 *                 type: string
 *               data_nascimento:
 *                 type: string
 */
router.post("/user/listar/pet/cadastar", verificarToken, cadastrar_pet)


/**
 * @swagger
 * /listar/pet:
 *   get:
 *     summary: Lista pets publicamente
 *     tags: [Pets]
 */
router.get("/listar/pet", listar_pet_n_logada)


/**
 * @swagger
 * /user/listar/pet:
 *   get:
 *     summary: Lista pets do usuário autenticado
 *     tags: [Pets]
 */
router.get("/user/listar/pet", verificarToken, listar_pet)


/**
 * @swagger
 * /editar/pet/{id}:
 *   get:
 *     summary: Exibe informações para edição do pet
 *     tags: [Pets]
 */
router.get("/editar/pet/:id", editar_pet_n_logada)


/**
 * @swagger
 * /user/editar/pet/{id}:
 *   put:
 *     summary: Atualiza informações do pet
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               especie:
 *                 type: string
 *               sexo:
 *                 type: string
 *               data_nascimento:
 *                 type: string
 */
router.put("/user/listar/pet/editar/:id", verificarToken, editar_pet)


/**
 * @swagger
 * /delete/pet/{id}:
 *   get:
 *     summary: Exibe informações para exclusão do pet
 *     tags: [Pets]
 */
router.get("/delete/pet/:id", excluir_pet_n_logada)


/**
 * @swagger
 * /user/delete/pet/{id}:
 *   delete:
 *     summary: Remove um pet cadastrado
 *     tags: [Pets]
 */
router.delete("/user/listar/pet/delete/:id", verificarToken, excluir_pet)


/**
 * @swagger
 * /agendamento:
 *   get:
 *     summary: Exibe informações sobre agendamentos
 *     tags: [Agendamento]
 */
router.get("/agendamento", agendamento_n_logada)


router.post("/user/agendamento", verificarToken, agendamento)

router.get("/consultas", consultas_n_logado)

router.get("/user/consultas", verificarToken, consultas)

router.post("/user/planos/pagamento", verificarToken, pagamento)

router.get("/user/planos", verificarToken, planos)

router.delete("/user/planos/cancelar", verificarToken, cancelar_plano)

export default router