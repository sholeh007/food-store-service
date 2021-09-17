const DeliveryAddress = require("./model");
const { subject } = require("@casl/ability");
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

async function update(req, res, next) {
  const policy = policyFor(req.user);

  try {
    const { id } = req.params;
    const address = await DeliveryAddress.findById(id);

    // buat payload dan keluarkan _id
    const { _id, ...payload } = req.body;
    const subjectAddress = subject("DeliveryAddress", {
      ...address,
      user_id: address.user,
    });

    if (!policy.can("update", subjectAddress)) {
      return res.json({
        error: 1,
        message: `You're not allowed to modify this resource`,
      });
    }

    address = await DeliveryAddress.findByIdAndUpdate(id, payload, {
      new: true,
    });

    return res.json(address);
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
  update,
};
