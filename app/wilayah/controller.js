const csv = require("csvtojson");
const path = require("path");

async function getProvinsi(req, res, next) {
  const db_provinsi = path.resolve(__dirname, "./data/provinces.csv");

  try {
    const data = await csv().fromFile(db_provinsi);
    return res.status(200).json(data);
  } catch (err) {
    return res.json({
      error: 1,
      message: "tidak bisa mengambil data provinsi",
    });
  }
}

async function getKabupaten(req, res, next) {
  const db_kabupaten = path.resolve(__dirname, "./data/regencies.csv");
  try {
    const { kode_induk } = req.query;
    const data = await csv().fromFile(db_kabupaten);

    if (!kode_induk) return res.json(data);

    const kabupaten = data.filter(
      (kabupaten) => kabupaten.kode_provinsi === kode_induk
    );
    return res.status(200).json(kabupaten);
  } catch (err) {
    return res.json({
      error: 1,
      message: "Tidak bisa mengambil data kabupaten",
    });
  }
}

async function getKecamatan(req, res, next) {
  const db_kecamatan = path.resolve(__dirname, "./data/districts.csv");
  try {
    const { kode_induk } = req.query;
    const data = await csv().fromFile(db_kecamatan);

    if (!kode_induk) return res.json(data);

    const distrik = data.filter(
      (distrik) => distrik.kode_kabupaten === kode_induk
    );

    return res.status(200).json(distrik);
  } catch (err) {
    return res.json({
      error: 1,
      message: "Tidak dapat mengambil data kecamatan",
    });
  }
}
module.exports = {
  getProvinsi,
  getKabupaten,
  getKecamatan,
};
