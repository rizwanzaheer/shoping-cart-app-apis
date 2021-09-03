const { NOT_FOUND, BAD_REQUEST } = require('http-status');

// Models
const { Order } = require('../models');

// Utils
const ApiError = require('../utils/ApiError');

/**
 * Create a order
 * @param {Object} orderBody
 * @returns {Promise<Order>}
 */
const createOrder = async (orderBody) => {
  const order = await Order.create(orderBody);
  return order;
};

/**
 * Query for orders
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOrders = async (filter, options) => {
  const orders = await Order.paginate(filter, options);
  return orders;
};

/**
 * Get Order by id
 * @param {ObjectId} id
 * @returns {Promise<Order>}
 */
const getOrderById = async (id) => {
  return Order.findById(id);
};

/**
 * Search Order by orderId
 * @param {string} orderId
 * @returns {Promise<Order>}
 */
const searchOrderByOrderId = async (orderId) => {
  return Order.find({
    $or: [{ orderId: { $regex: '.*' + orderId.toLowerCase() + '.*' } }],
  });
};

/**
 * Update Order by id
 * @param {ObjectId} orderId
 * @param {Object} updateBody
 * @returns {Promise<Order>}
 */
const updateOrderById = async (orderId, updateBody) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(NOT_FOUND, 'Order not found');
  }

  Object.assign(order, updateBody);
  await order.save();
  return order;
};

/**
 * Update order by id with any constrain
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<Order>}
 */
const updateOrderByIdGeneric = async (id, updateBody) => {
  const order = await Order.findByIdAndUpdate(id, updateBody).exec();
  return order;
};

/**
 * Delete order by id
 * @param {ObjectId} orderId
 * @returns {Promise<Order>}
 */
const deleteOrderById = async (orderId) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(NOT_FOUND, 'Order not found');
  }
  await order.remove();
  return order;
};

module.exports = {
  createOrder,
  queryOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  searchOrderByOrderId,
  updateOrderByIdGeneric,
};
