const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const tagSchema = new Schema({
  name: {
    type: String,
    minlength: [3, "Panjang tag min 3 karakter"],
    maxlength: [20, "Panjang tag max 20 karakter "],
    required: [true, "tag harus diisi"],
  },
});

module.exports = model("Tag", tagSchema);
