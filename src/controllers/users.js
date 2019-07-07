const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Model = require('../models/users');
const {
  internalServerErrorResponse,
  // nullResponse,
  badRequestResponse,
  checkAdminRoute,
} = require('../helpers/errorHandler');

class UserController {
  static model() {
    return new Model('users');
  }

  // Creates new user
  static async signUpUser(req, res) {
    try {
      const role = checkAdminRoute(req.path) ? 'true' : 'false';
      const {
        email,
        first_name: firstName,
        last_name: lastName,
        password,
      } = req.body;
      // Search model to check if user is already registered
      const user = await UserController.model().select('email', `WHERE email='${email}'`);
      if (user.length) return badRequestResponse(req, res, 'User already registered');
      // Hashing password with salt
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      // Creates new user and return user data
      const data = await UserController.model()
        .insert('email, first_name, last_name, password, is_admin', `'${email}', '${firstName}', '${lastName}', '${hashPassword}', '${role}'`);
      const { id, is_admin: isAdmin } = data[0];
      const jwtPrivateKey = process.env.NODE_ENV === 'test' ? process.env.TEST_JWT_PRIVATE_KEY || process.env.JWT_PRIVATE_KEY : process.env.JWT_PRIVATE_KEY;
      const token = jwt.sign({ email }, jwtPrivateKey);
      return res.status(201).json({
        data: {
          user_id: id,
          is_admin: isAdmin,
          token,
        },
        status: 'success',
      });
    } catch (e) {
      return internalServerErrorResponse(req, res, e.message);
    }
  }

  static async signInUser(req, res) {
    try {
      const {
        email,
        password,
      } = req.body;
      const data = await UserController.model().select('email, paasword, is_admin', `WHERE email='${email}'`);
      if (!data.length) return badRequestResponse(req, res, 'Invalid email');
      const validPassword = await bcrypt.compare(password, data[0].password);
      if (!validPassword) return badRequestResponse(req, res, 'Invalid password');
      return res.status(200).json({
        message: 'User loged in successfully',
        status: 'success',
      });
    } catch (e) {
      return internalServerErrorResponse(req, res, e.message);
    }
  }

  static async deleteUser(req, res) {
    try {
      const { email } = req.body;
      await UserController.model()
        .delete('email', email);
      return res.status(202).json({
        message: 'User was deleted successfully',
        status: 'success',
      });
    } catch (e) {
      return internalServerErrorResponse(req, res, e.message);
    }
  }
}

module.exports = UserController;
