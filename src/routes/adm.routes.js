import { Router } from 'express'
import { cadastar_funcionario, cadastro_adm, editar_adm, editar_funcionario, excluir_adm, excluir_funcionario, home_adm, listar_adm, listar_adm_esp, listar_funcionario, listar_funcionario_esp, logout_adm } from '../controllers/adm.controller.js'

import { verificarTokenAdmin } from '../middlewares/logger.middleware.js'

const router = Router()


/**
 * @swagger
 * /adm:
 *   get:
 *     summary: Acessa a área principal do administrador
 *     tags: [Administrador]
 *     responses:
 *       200:
 *         description: Acesso autorizado
 *       401:
 *         description: Token inválido ou acesso negado
 */
router.get("/", verificarTokenAdmin, home_adm)


/**
 * @swagger
 * /adm/logout:
 *   get:
 *     summary: Realiza logout do administrador
 *     tags: [Administrador]
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *       401:
 *         description: Token inválido
 */
router.get("/logout", verificarTokenAdmin, logout_adm)


/**
 * @swagger
 * /adm/listar/adm/cadastrar:
 *   post:
 *     summary: Cadastra um novo administrador
 *     tags: [Administrador]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               ativo:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Administrador cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Acesso não autorizado
 */
router.post("/listar/adm/cadastrar", verificarTokenAdmin, cadastro_adm)


/**
 * @swagger
 * /adm/listar/adm/cadastrar/debug:
 *   post:
 *     summary: Cadastra administrador sem autenticação para debugar
 *     tags: [Administrador]
 *     responses:
 *       201:
 *         description: Administrador cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/listar/adm/cadastrar/debug", cadastro_adm)

router.get("/listar/adm", verificarTokenAdmin, listar_adm)
router.get("/listar/adm/:id", verificarTokenAdmin, listar_adm_esp)
router.put("/listar/adm/editar/:id", verificarTokenAdmin, editar_adm)
router.delete("/listar/adm/excluir/:id", verificarTokenAdmin, excluir_adm)

/**
 * @swagger
 * /adm/listar/funcionario/cadastrar:
 *   post:
 *     summary: Cadastra um novo funcionario
 *     tags: [Administrador]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               sobrenome:
 *                 type: string
 *               especialidade:
 *                 type: string
 *               registro:
 *                 type: string
 *               senha:
 *                 type: string
 *               ativo:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Funcionario cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Acesso não autorizado
 */

router.post("/listar/funcionario/cadastrar", verificarTokenAdmin, cadastar_funcionario)
router.get("/listar/funcionario", verificarTokenAdmin, listar_funcionario)
router.get("/listar/funcionario/:id", verificarTokenAdmin, listar_funcionario_esp)
router.put("/listar/funcionario/editar/:id", verificarTokenAdmin, editar_funcionario)
router.delete("/listar/funcionario/excluir/:id", verificarTokenAdmin, excluir_funcionario)

export default router