const DeliveryAddress = require("./model");
const { subject } = require("@casl/ability");
const { policyFor } = require("../policy");

async function index(req, res, next) {
  const policy = policyFor(req.user);

  if (!policy.can("view", "DeliveryAddress")) {
    return res.json({
      error: 1,
      message: `You're not allowed to perform this action`,
    });
  }

  try {
    const { limit = 10, skip = 0 } = req.query;
    const count = await DeliveryAddress.find({
      user: req.user._id,
    }).countDocument();
    const deliveryAddress = await DeliveryAddress.find({ user: req.user._id })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort("-createdAt");

    return res.json({ data: deliveryAddress, count });
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

async function destroy(req, res, next) {
  const policy = policyFor(req.user);

  try {
    const { id } = req.params;

    const address = await DeliveryAddress.findById(id);
    const subjectAddress = subject({ ...address, user: address.user });

    if (!policy.can("delete", subjectAddress)) {
      return res.json({
        error: 1,
        message: `You're not allowed to delete this resource`,
      });
    }

    await DeliveryAddress.findByIdAndDelete(id);

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
  destroy,
  index,
};
