const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const { decodeToken } = require("./app/auth/middlewware");
const productRouter = require("./app/product/router");
const categoryRouter = require("./app/category/router");
const tagRouter = require("./app/tag/router");
const authRouter = require("./app/auth/router");
const wilayahRouter = require("./app/wilayah/router");
const deliveryRouter = require("./app/delivery-address/router");
const cartRouter = require("./app/cart-item/router");
const orderRouter = require("./app/order/router");
const invoiceRouter = require("./app/invoice/router");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ credentials: true, origin: "http://localhost:5000" }));
app.use(decodeToken());

app.use("/api", productRouter);
app.use("/api", categoryRouter);
app.use("/api", tagRouter);
app.use("/api", wilayahRouter);
app.use("/api", deliveryRouter);
app.use("/api", cartRouter);
app.use("/api", orderRouter);
app.use("/api", invoiceRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
