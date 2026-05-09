import swaggerJsdoc from 'swagger-jsdoc'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PetVitaliz API',
            version: '1.0.0',
            description: 'Documentação da API'
        },
        servers: [
            {
                url: 'http://localhost:3000'
            }
        ]
    },

    apis: [
        path.join(__dirname, '../routes/*.js'),
        path.join(__dirname, '../controllers/*.js')
    ]
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec
