const User = require("../user/model");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config");
const { getToken } = require("../utils/get-token");

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

async function localStrategy(email, password, done) {
  try {
    // method select abaikan field yang ada tanda "-"
    const user = await User.findOne({ email }).select(
      "-__V -createdAt -updatedAt -cart_items -token"
    );
    if (!user) {
      return done();
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      done();
    }

    // berikan data user tanpa password
    ({ password, ...userWithoutPassword } = user.toJSON());

    return done(null, userWithoutPassword);
  } catch (error) {
    done(error, null);
  }
}

async function login(req, res, next) {
  passport.authenticate("local", async function (err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res
        .status(401)
        .json({ error: 1, message: "email or password incorrect" });
    }

    const signed = jwt.sign(user, config.secretKey, { expiresIn: "1d" });
    await User.findOneAndUpdate(
      { _id: user._id },
      { $push: { token: signed } },
      { new: true }
    );

    return res.status(200).json({
      user,
      message: "login success",
      token: signed,
    });
  })(req, res, next);
}

async function logout(req, res, next) {
  const token = getToken(req);

  const user = await User.findOneAndUpdate(
    { token: { $in: [token] } },
    { $pull: { token } },
    { useFindAndModify: false }
  );

  if (!user || !token) {
    return res.json({
      error: 1,
      message: "No User Found",
    });
  }

  return res.status(200).json({
    error: 0,
    message: "Logout berhasil",
  });
}

function me(req, res, next) {
  if (!req.user) {
    return res.json({
      error: 1,
      message: "Your not login or token expired",
    });
  }

  return res.status(200).json(req.user);
}

module.exports = {
  register,
  localStrategy,
  login,
  me,
  logout,
};
