import { Router } from 'express'
import {
    cadastro_adm,
    home_adm,
    logout_adm
} from '../controllers/adm.controller.js'

import {
    verificarTokenAdmin
} from '../middlewares/logger.middleware.js'

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
 *     summary: Cadastra administrador sem autenticação para debug
 *     tags: [Administrador]
 *     responses:
 *       201:
 *         description: Administrador cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/listar/adm/cadastrar/debug", cadastro_adm)

export default router