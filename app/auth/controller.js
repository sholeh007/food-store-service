const User = require("../user/model");

async function register(req, res, next) {
  try {
    const payload = req.body;

    const user = new User(payload);
    await user.save();

    return res.status(200).json(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
}

module.exports = {
  register,
};
