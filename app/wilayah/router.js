const router = require("express").Router();
const controller = require("./controller");

router.get("/wilayah/provinsi", controller.getProvinsi);
router.get("/wilayah/kabupaten", controller.getKabupaten);
router.get("/wilayah/kecamatan", controller.getKecamatan);
router.get("/wilayah/desa", controller.getDesa);

module.exports = router;
