const DeliveryAddress = require("./model");
const { policyFor } = require("../policy");

async function store(req, res, next) {
  const policy = policyFor(req.user);

  if (!policy.can("create", "DeliveryAddress")) {
    return res.json({
      error: 1,
      message: `You're not allowed to perform this action`,
    });
  }

  try {
    const payload = req.body;
    const user = req.user;

    const address = new DeliveryAddress({ ...payload, user: user._id });
    await address.save();

    return res.jsno(address);
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
