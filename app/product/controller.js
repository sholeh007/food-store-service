const fs = require("fs");
const path = require("path");
const config = require("../config");
const Product = require("./model");

async function index(req, res, next) {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}

async function store(req, res, next) {
  try {
    const payload = req.body;

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

module.exports = {
  index,
  store,
};
