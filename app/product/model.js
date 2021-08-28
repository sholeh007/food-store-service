const mongoose = require("mongoose");

const { model, Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [3, "Panjang nama makanan minimal 3 karakter"],
      require: [true, "Nama product harus diisi"],
    },
    description: {
      type: String,
      maxlength: [1000, "Panjang deskripsi maksimal 1000 karakter"],
    },
    price: {
      type: Number,
      default: 0,
    },
    image_url: String,
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("product", productSchema);
