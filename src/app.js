const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const express = require('express');
const { NOT_FOUND } = require('http-status');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');

// Routes
const routes = require('./routes/v1');

// Middlewares
const { authLimiter } = require('./middlewares/rateLimiter');
const { errorConverter, errorHandler } = require('./middlewares/error');

// Utils
const ApiError = require('./utils/ApiError');

// Config
const morgan = require('./config/morgan');
const { apiVersion, env } = require('./config/config');

const app = express();

if (env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// limit repeated failed requests to auth endpoints
if (env === 'production') {
  app.use(`/api/${apiVersion}/auth`, authLimiter);
}

// ${apiVersion} = v1 api routes
app.use(`/api/${apiVersion}`, routes);
// used for to access the static files
app.use(`/files`, express.static('files'));

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(NOT_FOUND, 'Route Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
