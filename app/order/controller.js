const mongoose = require("mongoose");
const Order = require("./model");
const OrderItem = require("../order-item/model");
const CartItem = require("../cart-item/model");
const DeliveryAddress = require("../delivery-address/model");
const { policyFor } = require("../policy");
const { subject } = require("@casl/ability");

async function index(req, res, next) {
  const policy = policyFor(req.user);

  if (!policy.can("view", "Order")) {
    return res.status(403).json({
      error: 1,
      message: `You're not allowed to perform this action`,
    });
  }

  try {
    const { limit = 10, skip = 0 } = req.query;
    const count = await Order.find({ user: req.user._id }).countDocuments();
    // sorting descending
    const orders = await Order.find({ user: req.user._id })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate("order_items")
      .sort("-createdAt");

    // toJSON({virtuals:true}) dibutuhkan karena schema order memiliki field virtual jika tidak digunakan maka field tersebut tidak ada pada saat diubah menjadi json
    return res.status(200).json({
      data: orders.map((order) => order.toJSON({ virtuals: true })),
      count,
    });
  } catch (err) {
    if (err.name == "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
}

async function store(req, res, next) {
  const policy = policyFor(req.user);

  if (!policy.can("create", "Order")) {
    return res.json({
      error: 1,
      message: `You're not allowed to perform this action`,
    });
  }

  try {
    const { delivery_fee, delivery_address } = req.body;
    const items = await CartItem.find({ user: req.user._id }).populate(
      "product"
    );

    if (!items.length) {
      return res.json({
        error: 1,
        message: `Can't create order because you have no items in cart`,
      });
    }

    const address = await DeliveryAddress.findById(delivery_address);

    const order = new Order({
      _id: new mongoose.Types.ObjectId(),
      status: "waiting_payment",
      delivery_fee,
      delivery_address: {
        provinsi: address.provinsi,
        kabupaten: address.kabupaten,
        kecamatan: address.kecamatan,
        kelurahan: address.kelurahan,
        detail: address.detail,
      },
      user: req.user._id,
    });

    const orderItems = await OrderItem.insertMany(
      items.map((item) => ({
        ...item,
        name: item.product.name,
        qty: +item.qty,
        price: +item.product.price,
        order: order._id,
        product: item.product._id,
      }))
    );

    orderItems.forEach((item) => order.order_items.push(item));

    await order.save();
    await CartItem.deleteMany({ user: req.user._id });

    return res.json(order);
  } catch (err) {
    if (err.name == "ValidationError") {
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
  index,
  store,
};
