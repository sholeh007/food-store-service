const mongoose = require("mongoose");

const { model, Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    minLength: [3, "Panjang nama kategori min 3 karakter"],
    maxLength: [20, "Panjang nama kategori max 20 karakter"],
    required: [true, "Nama kategori harus diisi"],
  },
});

module.exports = model("category", categorySchema);
