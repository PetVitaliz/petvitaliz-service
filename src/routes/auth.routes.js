import { Router } from 'express'
import {
    cadastro,
    confirmar_codigo,
    login_adm,
    login_funcionario,
    login_usuario,
    logout,
    pedir_reset_senha,
    reset_senha
} from '../controllers/auth.controller.js'

import {
    verificarToken,
    verificarTokenReset
} from '../middlewares/logger.middleware.js'

const router = Router()


/**
 * @swagger
 * /auth/cadastro:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags: [Auth]
 *     
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
 *               email:
 *                 type: string
 *               CPF:
 *                 type: string
 *               telefone:
 *                 type: string
 *               genero:
 *                 type: string
 *               data_nascimento:
 *                 type: string
 *               senha:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/cadastro", cadastro)


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Auth]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", login_usuario)


/**
 * @swagger
 * /auth/login/adm:
 *   post:
 *     summary: Realiza login do administrador
 *     tags: [Auth]
 *      
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login/adm", login_adm)


/**
 * @swagger
 * /auth/login/funcionario:
 *   post:
 *     summary: Realiza login do funcionário
 *     tags: [Auth]
 * 
 *  requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               registro:
 *                 type: string
 *               senha:
 *                 type: string
 * 
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login/funcionario", login_funcionario)


/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Realiza logout do usuário autenticado
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 */
router.get("/logout", verificarToken, logout)


/**
 * @swagger
 * /auth/login/esqueci-a-senha:
 *   post:
 *     summary: Envia código para recuperação de senha
 *     tags: [Auth]
 *  requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Código enviado com sucesso
 *       404:
 *         description: Email não encontrado
 */
router.post("/login/esqueci-a-senha", pedir_reset_senha)


/**
 * @swagger
 * /auth/login/esqueci-a-senha-confirmar:
 *   post:
 *     summary: Confirma o código de recuperação
 *     tags: [Auth]
 * 
 *  requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 * 
 *     responses:
 *       200:
 *         description: Código validado com sucesso
 *       404:
 *         description: Código inválido
 */
router.post("/login/esqueci-a-senha-confirmar", confirmar_codigo)


/**
 * @swagger
 * /auth/login/alterar-senha:
 *   put:
 *     summary: Altera a senha do usuário
 *     tags: [Auth]
 * 
 *  requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senha1:
 *                 type: string
 *               senha2:
 *                 type: string
 * 
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.put("/login/alterar-senha", verificarTokenReset, reset_senha)

export default router