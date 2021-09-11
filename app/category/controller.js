const Category = require("./model");
const { policyFor } = require("../policy/index");

async function store(req, res, next) {
  try {
    const payload = req.body;
    const policy = policyFor(req.user);

    if (!policy.can("create", "Category")) {
      return res.json({
        error: 1,
        message: "Anda tidak memliki akses",
      });
    }

    const category = new Category(payload);
    await category.save();

    return res.status(200).json(category);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }

    next(error);
  }
}

async function update(req, res, next) {
  try {
    const payload = req.body;
    const policy = policyFor(req.user);
    if (!policy.can("update", "Category")) {
      return res.json({
        error: 1,
        message: "Anda tidak memliki akses",
      });
    }

    const category = await Category.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json(category);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }

    next(error);
  }
}

async function destroy(req, res, next) {
  try {
    const policy = policyFor(req.user);
    if (!policy.can("delete", "Category")) {
      return res.json({
        error: 1,
        message: "Anda tidak memliki akses",
      });
    }
    const category = await Category.findByIdAndDelete(req.params.id);

    return res.status(200).json(category);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  store,
  update,
  destroy,
};
