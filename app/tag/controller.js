const Tag = require("./model");
const { policyFor } = require("../policy/index");

async function store(req, res, next) {
  try {
    const payload = req.body;
    const policy = policyFor(req.user);
    if (!policy.can("create", "Tag")) {
      return res.json({
        error: 1,
        message: "Anda tidak memliki akses",
      });
    }

    const tag = new Tag(payload);
    await tag.save();

    return res.status(200).json(tag);
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
  try {
    const policy = policyFor(req.user);
    if (!policy.can("update", "Tag")) {
      return res.json({
        error: 1,
        message: "Anda tidak memliki akses",
      });
    }

    const payload = req.body;
    const tag = await Tag.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json(tag);
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
  try {
    const policy = policyFor(req.user);
    if (!policy.can("delete", "Tag")) {
      return res.json({
        error: 1,
        message: "Anda tidak memliki akses",
      });
    }

    const tag = await Tag.findByIdAndDelete(req.params.id);

    return res.status(200).json(tag);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  store,
  update,
  destroy,
};
