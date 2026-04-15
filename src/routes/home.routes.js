import { Router } from 'express'
import { home, home_n_logada } from '../controllers/home.controller.js'
import { verificarToken } from '../middlewares/logger.middleware.js'


const router = Router()

router.get("/", home_n_logada)
router.get("/user/home", verificarToken, home)

export default router
