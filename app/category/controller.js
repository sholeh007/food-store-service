const Category = require("./model");

async function store(req, res, next) {
  try {
    const payload = req.body;

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

module.exports = {
  store,
};
