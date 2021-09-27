const Invoice = require("./model");
const { subject } = require("@casl/ability");
const { policyFor } = require("../policy");

async function show(req, res, next) {
  try {
    const policy = policyFor(req.user);
    const { order_id } = req.params;
    const invoice = await Invoice.findOne({ order: order_id })
      .populate("order")
      .populate("user");
    const subjectInvoice = subject("Invoice", {
      ...invoice,
      user_id: invoice.user._id,
    });

    if (!policy.can("read", subjectInvoice)) {
      return res.json({
        error: 1,
        message: "Anda tidak memiliki akses untuk melihat invoice ini",
      });
    }

    return res.json(invoice);
  } catch (err) {
    return res.json({
      error: 1,
      message: "Error when getting invoice",
    });
  }
}

module.exports = {
  show,
};
