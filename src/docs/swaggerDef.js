const { version } = require('../../package.json');
const { port, apiVersion } = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Order 24 API Assignment documentation',
    version,
    // license: {
    //   name: 'MIT',
    //   url: 'https://github.com/order24-api-assignment/blob/master/LICENSE', // In case if we have a license
    // },
  },
  servers: [
    {
      url: `http://localhost:${port}/api/${apiVersion}`,
    },
  ],
};

module.exports = swaggerDef;
