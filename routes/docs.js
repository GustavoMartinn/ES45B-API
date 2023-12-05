const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger_output.json');

const express = require('express');
const router = express.Router();

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = router;


