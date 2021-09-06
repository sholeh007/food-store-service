const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema, model } = mongoose;
const saltRounds = 10;

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

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

userSchema.path("email").validate(
  (value) => {
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return EMAIL_RE.test(value);
  },
  (err) => `email ${err.value} tidak valid`
);

userSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("User").count({ email: value });

      return !count;
    } catch (error) {
      throw error;
    }
  },
  (err) => `${err.value} sudah terdaftar`
);

module.exports = model("User", userSchema);
