const router = require("express").Router();
const controller = require("./controller");

router.get("/wilayah/provinsi", controller.getProvinsi);
router.get("/wilayah/kabupaten", controller.getKabupaten);

module.exports = router;
