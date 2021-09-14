const router = require("express").Router();
const controller = require("./controller");

router.get("/wilayah/provinsi", controller.getProvinsi);

module.exports = router;
