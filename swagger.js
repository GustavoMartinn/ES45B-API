const swaggerAutoGen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
endpointsFiles = ['./app.js'];

const doc = {
    info: {
        version: '1.0.0',
        title: 'API',
        description: 'API para controle de finanças pessoais',
    },
    host: 'localhost:3000',
    basePath: '/',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            name: 'User',
            description: 'Endpoints para manipulação de usuários',
        },
        {
            name: 'Admin',
            description: 'Endpoints para manipulação de administradores',
        },
        {
            name: 'Bank Account',
            description: 'Endpoints para manipulação de contas bancárias',
        },
        {
            name: 'Investment',
            description: 'Endpoints para manipulação de investimentos',
        },
        {
            name: 'Transaction',
            description: 'Endpoints para manipulação de transações',
        },

    ],
}

swaggerAutoGen(outputFile, endpointsFiles, doc);
