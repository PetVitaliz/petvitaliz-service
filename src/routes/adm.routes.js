import { Router } from 'express'
import { cadastar_funcionario, cadastro_adm, cadastro_produto, editar_adm, editar_funcionario, editar_produto, excluir_adm, excluir_funcionario, excluir_produto, home_adm, home_consultas_adm, listar_adm, listar_adm_esp, listar_clientes_adm, listar_funcionario, listar_funcionario_esp, listar_produto_especifico, listar_produtos, logout_adm, uploadImagem } from '../controllers/adm.controller.js'
import { verificarTokenAdmin } from '../middlewares/logger.middleware.js'
import { uploadConfig } from '../middlewares/upload.middleware.js'

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
router.get("", verificarTokenAdmin, home_adm)


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
router.post("/listar/adm/cadastrar", verificarTokenAdmin, uploadConfig.single('image'), cadastro_adm)


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
router.put("/listar/adm/editar/:id", verificarTokenAdmin, uploadConfig.single('image'), editar_adm)
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

router.post("/listar/funcionario/cadastrar", verificarTokenAdmin, uploadConfig.single('image'), cadastar_funcionario)
router.get("/listar/funcionario", verificarTokenAdmin, listar_funcionario)
router.get("/listar/funcionario/:id", verificarTokenAdmin, listar_funcionario_esp)
router.put("/listar/funcionario/editar/:id", verificarTokenAdmin, uploadConfig.single('image'), editar_funcionario)
router.delete("/listar/funcionario/excluir/:id", verificarTokenAdmin, excluir_funcionario)


router.post("/listar/produtos/cadastrar", verificarTokenAdmin, cadastro_produto)
router.get("/listar/produtos", listar_produtos)
router.get("/listar/produtos/:id", verificarTokenAdmin, listar_produto_especifico)
router.put("/listar/produtos/editar/:id", verificarTokenAdmin, editar_produto)
router.delete("/listar/produtos/excluir/:id", verificarTokenAdmin, excluir_produto)

router.post("/upload", verificarTokenAdmin, uploadConfig.single('image'), uploadImagem)
router.get("/consultas", verificarTokenAdmin, home_consultas_adm);
router.get("/listar/clientes", verificarTokenAdmin, listar_clientes_adm);

export default router
