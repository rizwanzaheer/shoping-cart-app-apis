const { CREATED, NOT_FOUND, NO_CONTENT } = require('http-status');
const _ = require('lodash');
// Services
const { orderService, userService } = require('../services');

// Utils
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createOrder = catchAsync(async (req, res) => {
  const { firstName, lastName, email } = req.body;

  // 1. Check the email exist or not
  if (!req.body.hasOwnProperty('email')) {
    throw new ApiError(NOT_FOUND, 'Email is required to place order!');
  }

  // 2. create the order using user order information
  req.body.orderNumber = parseInt(Math.random() * 10000);
  const order = await orderService.createOrder(req.body);

  // 3. create user information & store in user information table
  let user = await userService.getUserByEmail(req.body.email);

  if (!_.isEmpty(user)) {
    const updateUserInfo = {
      $push: {
        _orders: order.id,
      },
    };
    await userService.updateUserByIdGeneric(user.id, updateUserInfo);
  } else {
    const userInfo = {
      firstName,
      lastName,
      email,
      _orders: order.id,
    };

    user = await userService.createUser(userInfo);
  }

  // 4. store new created user id against the order in or table
  const updateOrderInfo = {
    _orderBy: user.id,
  };
  const orderInfo = await orderService.updateOrderByIdGeneric(order.id, updateOrderInfo);

  // 5. send the response to user
  res.status(CREATED).send({ orderInfo, user });
});

const getOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['orderId', 'deliverAt', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.populate = '_orderProducts.productId,_orderBy';

  const result = await orderService.queryOrders(filter, options);
  res.send(result);
});

const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);
  if (!order) {
    throw new ApiError(NOT_FOUND, 'Order not found');
  }
  res.send(order);
});

const searchOrderByOrderId = catchAsync(async (req, res) => {
  const options = pick(req.query, ['name']);
  const order = await orderService.searchOrderByOrderId(req.query.name);
  if (order.length === 0) {
    throw new ApiError(NOT_FOUND, 'Order not found');
  }
  res.send(order);
});

const updateOrder = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderById(req.params.orderId, req.body);
  res.send(order);
});

const deleteOrder = catchAsync(async (req, res) => {
  await orderService.deleteOrderById(req.params.orderId);
  res.status(NO_CONTENT).send();
});

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  searchOrderByOrderId,
};
