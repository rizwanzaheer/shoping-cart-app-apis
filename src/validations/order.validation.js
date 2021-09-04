const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = {
  body: Joi.object().keys({
    orderNumber: Joi.number().integer().allow(null).empty(),
    deliverAt: Joi.date().iso(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),

    _orderProducts: Joi.array().items(
      Joi.object().keys({
        productId: Joi.required().custom(objectId),
        productQuantity: Joi.number().integer().allow(null, 0),
      })
    ),
    // _orderProducts: Joi.array().items(Joi.string().allow(null, '')).allow(null, ''),
    status: Joi.string().allow(null, '').empty().default('placed'),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    orderNumber: Joi.number()
      .integer()
      .allow(null)
      .empty()
      .default(parseInt(Math.random() * 10000)),
    deliverAt: Joi.date().iso(),
    status: Joi.string().allow(null, '').empty().default('placed'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

const searchOrderByOrderId = {
  query: Joi.object().keys({
    orderId: Joi.string().allow(null, ''),
  }),
};

const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email().allow('', null),
      name: Joi.string(),
    })
    .min(1),
};

const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  searchOrderByOrderId,
};
