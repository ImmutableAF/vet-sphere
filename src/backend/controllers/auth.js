const users = require('../models/users');

const loginController = (req, res) => {
  res.send('Login endpoint');
};

const registerController = (req, res) => {
  res.send('Register endpoint');
};

module.exports = {
  loginController,
  registerController,
};