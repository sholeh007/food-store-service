const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["waiting_payment", "processing", "in_delivery", "delivered"],
      default: "waiting_payment",
    },
    delivery_fee: {
      type: Number,
      default: 0,
    },
    delivery_address: {
      provinsi: { type: String, required: [true, "provinsi harus diisi."] },
      kabupaten: { type: String, required: [true, "kabupaten harus diisi."] },
      kecamatan: { type: String, required: [true, "kecamatan harus diisi."] },
      kelurahan: { type: String, required: [true, "kelurahan harus diisi."] },
      detail: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    order_items: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
  },
  { timestamps: true }
);

// automatis dibuat field order_number oleh plugin AutoIncrement
orderSchema.plugin(AutoIncrement, { inc_field: "order_number" });

// create virtual field only in mongoose not mongodb
const virtual = orderSchema.virtual("items_count");

virtual.get(function () {
  const totalItem = this.order_items.reduce((prev, item) => {
    return prev + parseInt(item.qty);
  }, 0);

  return totalItem;
});

module.exports = model("Order", orderSchema);
