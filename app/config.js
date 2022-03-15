const path = require("path");

module.exports = {
  rootPath: path.resolve(__dirname, ".."),
  secretKey: process.env.SECRET_KEY,
  serviceName: process.env.SERVICE_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASS,
  dbName: process.env.DB_NAME,
};
