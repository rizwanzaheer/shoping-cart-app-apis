const { NOT_FOUND, BAD_REQUEST } = require('http-status');

// Models
const { Product } = require('../models');

// Utils
const ApiError = require('../utils/ApiError');

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<product>}
 */
const createProduct = async (productBody) => {
  const product = await Product.create(productBody);
  return product;
};

/**
 * Query for products
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProducts = async (filter, options) => {
  const products = await Product.paginate(filter, options);
  return products;
};

/**
 * Get Product by id
 * @param {ObjectId} id
 * @returns {Promise<Product>}
 */
const getProductById = async (id) => {
  return Product.findById(id);
};

/**
 * Search Product by productId
 * @param {string} productId
 * @returns {Promise<Product>}
 */
const searchProductByProductName = async (name) => {
  return Product.find({
    $or: [{ name: { $regex: '.*' + name.toLowerCase() + '.*' } }],
  });
};

/**
 * Update product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(NOT_FOUND, 'Product not found');
  }

  Object.assign(product, updateBody);
  await product.save();
  return product;
};

/**
 * Update product by id with any constrain
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductByIdGeneric = async (id, updateBody) => {
  const product = await Product.findByIdAndUpdate(id, updateBody).exec();
  return product;
};

/**
 * Delete product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(NOT_FOUND, 'Product not found');
  }
  await product.remove();
  return product;
};

module.exports = {
  createProduct,
  queryProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  searchProductByProductName,
  updateProductByIdGeneric,
};
