import express from 'express'
import 'dotenv/config'
import { logger } from './middlewares/logger.middleware.js'
import authRoutes from './routes/auth.routes.js'

const app = express()
const Port = 3000


app.use(express.json())
app.use(logger)
app.use("/auth", authRoutes)



app.listen(Port, () => {
    console.log(`API rodando na porta ${Port}`);
})