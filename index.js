const express = require("express");
const path = require("path");
const cors = require("cors");
const createError = require("http-errors");

const UserRoute = require("./routes/login_route")
const ProductRoute = require("./routes/product_route");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./initDB")();

//require("./initDB_two")();

// app.all("/health", (req, res) => {
//   res.status(200).json({
//     health:"Working"
//   });
// });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", UserRoute);

app.use("/products", ProductRoute);

app.use((req, res, next) => {
  next(createError(404, "Not found"));
});

// Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

// app.all("/test", (req, res) => {
//    // console.log(req.query);
//    // res.send(req.query);
//    // console.log(req.params);
//    // res.send(req.params);

//     console.log(req.body);
//     res.send(req.body);
// });

// app.use((req, res, next) => {
//     // const err = new Error("Not found");
//     // err.status = 404;
//     // next(err);

//     next(createError(404, "Not found"));
// });
