const jwt = require("jsonwebtoken");
const { getToken } = require("../utils/get-token");
const User = require("../user/model");
const config = require("../config");

function decodeToken() {
  return async function (req, res, next) {
    try {
      const token = getToken(req);

      if (!token) return next();

      req.user = jwt.verify(token, config.secretKey);

      const user = await User.findOne({ token: { $in: [token] } });

      if (!user) {
        return res.status(404).json({
          error: 1,
          message: "Token Expired",
        });
      }
    } catch (err) {
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          error: 1,
          message: err.message,
        });
      }
      next(err);
    }
    return next();
  };
}

module.exports = {
  decodeToken,
};
