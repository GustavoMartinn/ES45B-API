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
        description: 'User related end-points',
        },
    ],
    definitions: {
        User: {
        id: '1',
        name: 'John Doe',
        email: '',
        },
    },
}

swaggerAutoGen(outputFile, endpointsFiles, doc);
