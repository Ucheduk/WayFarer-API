import verifyJwtToken from '../helpers/verifyJwtToken';
import {
  badRequestResponse,
  unauthorizedRequestResponse,
  forbiddenRequestResponse,
} from '../helpers/errorHandler';


export default class AuthMiddleware {
  // Check is User have valid token
  static async auth(req, res, next) {
    const { token } = req.body;
    if (!token) return unauthorizedRequestResponse(req, res, 'Access denied. No token provided.');

    try {
      const payload = verifyJwtToken(token);
      const { user_id: id } = payload;
      const { user_id: userId } = req.body;
      if (id !== userId) return forbiddenRequestResponse(req, res, 'Access denied. User not registered.');
      return next();
    } catch (ex) {
      return badRequestResponse(req, res, 'Invalid token.');
    }
  }

  // Check if User is an admin
  static admin(req, res, next) {
    const { token, is_admin: isAdmin } = req.body;
    const payload = verifyJwtToken(token);
    const { is_admin: isAdminPayload } = payload;
    if (!isAdmin || !isAdminPayload) return forbiddenRequestResponse(req, res, 'Access denied. User must be an Admin.');
    return next();
  }
}
