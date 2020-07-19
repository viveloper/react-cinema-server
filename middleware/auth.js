const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      next();
    } catch (e) {
      next(new Error(e.message));
    }
  } else {
    return next(new Error('Not authorize to access this route'));
  }
};
