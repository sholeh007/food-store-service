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

module.exports = {
  getProvinsi,
};
