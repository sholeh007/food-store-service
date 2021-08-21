const Product = require("./model");

async function store(req, res, next) {
  try {
    const payload = req.body;
    const product = new Product(payload);

    await product.save();
    return res.status(200).json(product);
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
  store,
};
