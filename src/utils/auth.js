const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  //  Get Token From header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({
      msg: 'No Token, authorization denied',
    });
  }

  // Verify token
  try {
    jwt.verify(token, process.env.JWTSECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: 'Token is not valid' });
      } else {
        req.user = decoded.user;
        console.log("decoded User: ", req.user);
        next();
      }
    });
  } catch (err) {
    console.error('something wrong with auth middleware');
    res.status(500).json({ msg: 'Server Error' });
  }
};
