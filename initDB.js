const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
module.exports = () => {
  mongoose
    .connect(process.env.MONGO_URI_TWO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("MongoDB connected 1");
      var names = [];
      //console.log(mongoose);
      var collections = mongoose.connections[0].collections;
      Object.keys(collections).forEach(function (k) {
        names.push(k);
      });

      console.log(names);
    })
    .catch((error) => {
      console.log(error);
    });

  mongoose.connection.on("connected", () => {
    console.log("Moongoose Connected to db1..");
  });

  mongoose.connection.on("error", (err) => {
    console.log(err.message);
  });

  mongoose.connection.on("disconnected", (err) => {
    console.log("Connection is disconnected1");
  });

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.log(
        "Mongoose connection is disconnected due to app termination1"
      );
      process.exit(0);
    });
  });
};
