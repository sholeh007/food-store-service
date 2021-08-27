const Tag = require("./model");

async function store(req, res, next) {
  try {
    const payload = req.body;

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

module.exports = {
  store,
};
