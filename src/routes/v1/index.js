const express = require('express');

// Routes

const rootRoute = require('./root.route');
const userRoute = require('./user.route');
const orderRoute = require('./order.route');
const productRoute = require('./product.route');
const docsRoute = require('./docs.route');

// Configs
const { env } = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/',
    route: rootRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/orders',
    route: orderRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
