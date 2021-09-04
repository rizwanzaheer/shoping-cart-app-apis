const { CREATED, NOT_FOUND, NO_CONTENT } = require('http-status');
// Services
const { userService } = require('../services');

// Utils
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['email', 'name', 'lastName']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.populate = '_orders.productId';
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const searchUserByName = catchAsync(async (req, res) => {
  const options = pick(req.query, ['name']);
  console.log('options is: ', options);
  const user = await userService.searchUserByName(req.query.name);
  if (user.length === 0) {
    throw new ApiError(NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  let user;
  if (req.body.hasOwnProperty('_orders')) {
    const updateBody = {
      ...req.body,
      $push: {
        _orders: req.body._orders,
      },
    };
    delete updateBody._orders;
    user = await userService.updateUserByIdGeneric(req.params.userId, updateBody);
  } else {
    user = await userService.updateUserById(req.params.userId, req.body);
  }

  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  searchUserByName,
};
