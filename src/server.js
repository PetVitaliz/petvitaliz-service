import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import { logger } from './middlewares/logger.middleware.js'
import authRoutes from './routes/auth.routes.js'
import homeRoutes from './routes/home.routes.js'

const app = express()
const Port = 3000

app.use(cors())
app.use(express.json())
app.use(logger)
app.use(cookieParser())

app.use("/user", authRoutes)
app.use("/", homeRoutes)


app.get("/status", async (req, res) => {
    try {
        const teste = await prisma.$connect()
        return res.status(200).send("ok")
    } catch (error) {
        return res.status(503).send("n ok")
    }
})

app.listen(Port, () => {
    console.log(`API rodando na porta ${Port}`);
})
