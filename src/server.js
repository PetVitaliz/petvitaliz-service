import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import { prisma } from './lib/prisma.js'
import { logger } from './middlewares/logger.middleware.js'
import authRoutes from './routes/auth.routes.js'
import homeRoutes from './routes/home.routes.js'
import admRoutes from './routes/adm.routes.js'
import funcionarioRoutes from './routes/funcionario.routes.js'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './docs/swagger.js'
import cloudinary from './lib/cloudnary.js'

const app = express()
const Port = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(logger)
app.use(cookieParser())

app.use("/user", authRoutes)
app.use("/", homeRoutes)
app.use("/adm", admRoutes)
app.use("/funcionario", funcionarioRoutes)

app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
)

app.get('/docs-json', (req, res) => {
    res.json(swaggerSpec)
})

app.get("/health", async (req, res) => {
    try {
        await prisma.$connect()
        await prisma.$queryRaw`SELECT 1`
        
        return res.status(200).send({
            API: "Rodando",
            DB: "ON"
        })
    } catch (error) {
        
        return res.status(503).send({
            API: "Rodando",
            DB: "OFF"
        })
    }
})

app.listen(Port, () => {
    console.log(`API rodando na porta ${Port}`);
})
