const fs = require("fs");
const path = require("path");
const config = require("../config");
const Product = require("./model");
const Category = require("../category/model");
const Tag = require("../tag/model");

async function index(req, res, next) {
  try {
    const { limit = 10, skip = 0, q = "" } = req.query;
    let criteria = {};

    // filter
    if (q.length) {
      criteria = { name: { $regex: `${q}`, $options: "i" } };
    }

    const products = await Product.find(criteria)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate("category")
      .populate("tag");
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}

async function store(req, res, next) {
  try {
    const payload = req.body;

    if (payload.category) {
      const category = await Category.findOne({
        name: { $regex: payload.category, $options: "i" },
      });

      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length) {
      const tags = await Tag.find({ nama: { $in: payload.tags } });
      if (tags.length) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      }
    }

    if (req.file) {
      const tmp_path = req.file.path;
      const originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      const fileName = req.file.filename + "." + originalExt;
      const target_path = path.resolve(
        config.rootPath,
        `public/images/${fileName}`
      );
      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          const product = new Product({ ...payload, image_url: fileName });
          await product.save();
          return res.status(200).json(product);
        } catch (err) {
          fs.unlinkSync(target_path);
          if (err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }
      });
      src.on("error", async () => {
        next(err);
      });
    } else {
      const product = new Product(payload);
      await product.save();
      return res.status(200).json(product);
    }
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
    const payload = req.body;

    if (payload.category) {
      const category = await Category.findOne({
        name: { $regex: payload.category, $options: "i" },
      });

      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length) {
      const tags = await Tag.find({ nama: { $in: payload.tags } });
      if (tags.length) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      }
    }

    if (req.file) {
      const tmp_path = req.file.path;
      const originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      const fileName = req.file.filename + "." + originalExt;
      const target_path = path.resolve(
        config.rootPath,
        `public/images/${fileName}`
      );
      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          const product = await Product.findById(req.params.id);
          const currentImg = `${config.rootPath}/public/images/${product.image_url}`;

          if (fs.existsSync(currentImg)) {
            fs.unlinkSync(currentImg);
          }
          const products = await Product.findByIdAndUpdate(
            req.params.id,
            { ...payload, image_url: fileName },
            { new: true, runValidators: true }
          );
          return res.status(200).json(products);
        } catch (err) {
          fs.unlinkSync(target_path);
          if (err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }
      });
      src.on("error", async () => {
        next(err);
      });
    } else {
      const product = await Product.findOneAndUpdate(
        { _id: req.params.id },
        payload,
        { new: true, runValidators: true }
      );
      return res.status(200).json(product);
    }
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
    const product = await Product.findByIdAndDelete(req.params.id);
    const curretImg = `${config.rootPath}/public/images/${product.image_url}`;

    if (fs.existsSync(curretImg)) {
      fs.unlinkSync(curretImg);
    }
    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  index,
  store,
  update,
  destroy,
};
