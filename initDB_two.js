const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
module.exports = () => {
  mongoose
    .createConnection(process.env.MONGO_URI_TWO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("MongoDB connected 2");
      var names = [];

      console.log("-----");
      console.log(mongoose.connections);
      console.log("-----");
      var collections = mongoose.connections[0].collections;
      Object.keys(collections).forEach(function (k) {
        names.push(k);
      });

      console.log(names);
      // mongoose.connection.db
      //   .listCollections()
      //   .toArray(function (err, names) {
      //     console.log(names); // [{ name: 'dbname.myCollection' }]
      //     // module.exports.Collection = names;
      //   });
    })
    .catch((error) => {
      console.log(error);
    });

  mongoose.connection.on("connected", () => {
    console.log("Moongoose Connected to db2..");
  });

  mongoose.connection.on("error", (err) => {
    console.log(err.message);
  });

  mongoose.connection.on("disconnected", (err) => {
    console.log("Connection is disconnected 2");
  });

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.log(
        "Mongoose connection is disconnected due to app termination 2"
      );
      process.exit(0);
    });
  });
};
