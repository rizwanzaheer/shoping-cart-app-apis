// eslint-disable-next-line no-param-reassign
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

// Plugins
const { toJSON, paginate, mongooseErrorHandler } = require('./plugins');

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },

    lastName: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      default: '',
    },
    email: {
      type: String,
      required: false,
      // unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    _orders: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Order',
      },
    ],
  },
  {
    // versionKey: false,
    timestamps: true,
    usePushEach: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);
userSchema.plugin(mongooseErrorHandler);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
