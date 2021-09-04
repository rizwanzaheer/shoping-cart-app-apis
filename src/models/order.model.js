// eslint-disable-next-line no-param-reassign
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Plugins
const { toJSON, paginate, mongooseErrorHandler } = require('./plugins');

const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      trim: true,
      required: [true, 'Order Id is requires!'],
      default: null,
    },
    deliverAt: {
      type: Date,
      trim: true,
      required: [true, 'Delivery at is requires!'],
      default: null,
    },
    status: {
      type: String,
      enum: ['placed', 'on-the-way', 'delivered', 'canceled'],
      default: 'placed',
      trim: true,
      lowercase: true,
    },
    _orderProducts: [
      {
        productId: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Product',
        },
        productQuantity: {
          type: Number,
          trim: true,
          required: true,
          default: null,
        },
      },
    ],

    _orderBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
  {
    // versionKey: false,
    timestamps: true,
    usePushEach: true,
  }
);

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);
orderSchema.plugin(mongooseErrorHandler);

/**
 * @typedef Order
 */
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
