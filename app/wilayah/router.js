const router = require("express").Router();
const controller = require("./controller");

router.get("/wilayah/provinsi", controller.getProvinsi);
router.get("/wilayah/kabupaten", controller.getKabupaten);
router.get("/wilayah/kecamatan", controller.getKecamatan);

module.exports = router;
