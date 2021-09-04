const { NOT_FOUND, BAD_REQUEST } = require('http-status');

// Models
const { User } = require('../models');

// Utils
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(BAD_REQUEST, 'Email already taken!');
  }
  const user = await User.create(userBody);
  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id).populate({ path: '_orders', populate: { path: '_orderProducts.productId' } });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Search user by name or lastname
 * @param {string} name
 * @returns {Promise<User>}
 */
const searchUserByName = async (name) => {
  return User.find({
    $or: [
      { name: { $regex: '.*' + name.toLowerCase() + '.*' } },
      { lastName: { $regex: '.*' + name.toLowerCase() + '.*' } },
    ],
  });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(BAD_REQUEST, 'email is already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const isEmailTaken = async (email) => {
  const user = await User.isEmailTaken(email);
  return user;
};

/**
 * Update user by id with any constrain
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserByIdGeneric = async (id, updateBody) => {
  const user = await User.findByIdAndUpdate(id, updateBody).exec();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  isEmailTaken,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  searchUserByName,
  updateUserByIdGeneric,
};
