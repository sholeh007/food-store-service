const Product = require("../product/model");
const CartItem = require("../cart-item/model");
const { policyFor } = require("../policy");

async function update(req, res, next) {
  const policy = policyFor(req.user);

  if (!policy.can("update", "Cart")) {
    return res.json({
      error: 1,
      message: `You're not allowed to perform this action`,
    });
  }

  try {
    const { items } = req.body;
    const productIds = items.map((item) => item._id);
    const products = await Product.find({ _id: { $in: productIds } });

    const cartItems = items.map((item) => {
      const relateProduct = products.find(
        (product) => product._id.toString() === item._id
      );

      return {
        _id: relateProduct._id,
        product: relateProduct._id,
        price: relateProduct.price,
        image_url: relateProduct.image_url,
        name: relateProduct.name,
        user: req.user._id,
        qty: item.qty,
      };
    });

    await CartItem.deleteMany({ user: req.user._id });
    await CartItem.bulkWrite(
      cartItems.map((item) => {
        return {
          updateOne: {
            filter: { user: req.user._id, product: item.product },
            update: item,
            upsert: true,
          },
        };
      })
    );

    return res.json(cartItems);
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
  update,
};
