const UserController = require('../controllers/users');
const UserMiddleware = require('../middlewares/users');

module.exports = (router) => {
  router.post('/auth/signup', UserMiddleware.validateUser, UserController.signUpUser);
  router.post('/admin/auth/signup', UserMiddleware.validateUser, UserController.signUpUser);
  router.post('/auth/signin', UserController.signInUser);
  return router;
};
