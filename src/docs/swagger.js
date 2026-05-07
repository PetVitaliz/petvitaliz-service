import swaggerJsdoc from 'swagger-jsdoc'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Minha API',
            version: '1.0.0',
            description: 'Documentação da API'
        },
        servers: [
            {
                url: 'http://localhost:3000'
            }
        ]
    },

    apis: ['./src/routes/*.js', './src/controllers/*.js']
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec