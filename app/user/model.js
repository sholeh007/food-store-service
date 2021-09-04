const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    full_name: {
      type: String,
      required: [true, "Nama harus didisi"],
      maxlength: [255, "karakter max 255"],
      minlength: [3, "min karakater 3"],
    },
    customer_id: Number,
    email: {
      type: String,
      required: [true, "Email harus diisi"],
      maxlength: [255, "Panjang password max 255 karakter"],
    },
    password: {
      type: String,
      required: [true, "Password harus didisi"],
      maxlength: [255, "Panjang password max 255 karakter"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
