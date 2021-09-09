const router = require("express").Router();
const multer = require("multer");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const controller = require("./controller");

// konfigurasi passport
passport.use(
  new LocalStrategy({ usernameField: "email" }, controller.localStrategy)
);

router.get("/me", controller.me);
router.post("/register", multer().none(), controller.register);
router.post("/login", multer().none(), controller.login);

module.exports = router;
