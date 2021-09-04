// eslint-disable-next-line no-param-reassign
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Plugins
const { toJSON, paginate, mongooseErrorHandler } = require('./plugins');

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is requires!'],
      trim: true,
      lowercase: true,
    },
    inStock: {
      type: Boolean,
      trim: true,
      lowercase: true,
      default: true,
    },
    availableStock: {
      type: Number,
      required: [true, 'Product Available Stock number is requires!'],
      trim: true,
      lowercase: true,
      default: '',
    },
    price: {
      type: String,
      required: [true, 'Product Price is requires!'],
      trim: true,
      lowercase: true,
      default: '',
    },
    imageName: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    originalImageName: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    imagePath: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    notAvailableFrom: {
      type: Date,
      trim: true,
      default: null,
    },
    notAvailableTo: {
      type: Date,
      trim: true,
      default: null,
    },
  },
  {
    // versionKey: false,
    timestamps: true,
    usePushEach: true,
  }
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);
productSchema.plugin(mongooseErrorHandler);

/**
 * @typedef Product
 */
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
