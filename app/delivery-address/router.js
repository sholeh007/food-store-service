const router = require("express").Router();
const multer = require("multer");
const addressController = require("./controller");

router.post("/delivery-address", multer().none(), addressController.store);

module.exports = router;
