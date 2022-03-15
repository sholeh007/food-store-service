const mongoose = require("mongoose");
const { dbUser, dbName, dbPassword } = require("../app/config");

mongoose.connect(
  `mongodb+srv://${dbUser}:${dbPassword}@foodstore.b9xea.mongodb.net/${dbName}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
);

const db = mongoose.connection;

module.exports = db;
