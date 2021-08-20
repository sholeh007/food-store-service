const Product = require("./model");

async function store(req, res, next) {
  const payload = req.body;
  const product = new Product(payload);

  await product.save();
  return res.status(200).json(product);
}

module.exports = {
  store,
};
