const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().allow(null, ''),
    inStock: Joi.boolean(),
    availableStock: Joi.string().allow(null, ''),
    price: Joi.string().allow(null, ''),
    imageName: Joi.string().allow(null, ''),
    imagePath: Joi.string().allow(null, ''),
    notAvailableFrom: Joi.date().iso().allow(null, ''),
    notAvailableTo: Joi.date().iso().allow(null, ''),
  }),
};

const getProducts = {
  query: Joi.object().keys({
    name: Joi.string().allow(null, ''),
    inStock: Joi.boolean(),
    availableStock: Joi.string().allow(null, ''),
    price: Joi.string().allow(null, ''),
    imageName: Joi.string().allow(null, ''),
    imagePath: Joi.string().allow(null, ''),
    notAvailableFrom: Joi.date().iso().allow(null, ''),
    notAvailableTo: Joi.date().iso().allow(null, ''),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const searchProductByName = {
  query: Joi.object().keys({
    productId: Joi.string().allow(null, ''),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().allow(null, ''),
      inStock: Joi.boolean(),
      availableStock: Joi.string().allow(null, ''),
      price: Joi.string().allow(null, ''),
      imageName: Joi.string().allow(null, ''),
      imagePath: Joi.string().allow(null, ''),
      notAvailableFrom: Joi.date().iso().allow(null, ''),
      notAvailableTo: Joi.date().iso().allow(null, ''),
    })
    .min(1),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProductByName,
};
