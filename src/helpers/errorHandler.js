module.exports = {
  internalServerErrorResponse: (req, res, error) => res.status(500)
    .json({
      error: error || 'Internal server error occured',
      status: 'error',
    }),

  nullResponse: (req, res, error) => res.status(404)
    .json({
      error: error || '404 Not found',
      status: 'error',
    }),

  badRequestResponse: (req, res, error) => res.status(400)
    .json({
      error: error || 'Bad request',
      status: 'error',
    }),

  checkAdminRoute: (path) => {
    const pattern = /\/admin\/auth\/(signin|signup)/i;
    if (pattern.test(path)) {
      return true;
    }
    return false;
  },
};
