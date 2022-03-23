const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const fs = require("fs");
var Binary = require("mongodb").Binary;
const Product = require("../models/Product");
const {fileSizeFormatter} = require('../helpers/filehelper');

module.exports = {
  getAllProducts: async (req, res, next) => {
    try {
      const authorization = req.headers.authorization;

      const user = jwt.verify(authorization, process.env.JWT_SECRET);

      const results = await Product.find({}, { __v: 0 });
      //const results = await Product.find({ price: 699 }, {});
      //const results = await Product.find({}, { name: 1, price: 1, _id: 0 });
      res.send(results);
    } catch (error) {
      next(error);
    }
  },
  findProductByID: async (req, res, next) => {
    try {
      const authorization = req.headers.authorization;

      const user = jwt.verify(authorization, process.env.JWT_SECRET);

      const id = req.params.id;
      //const product = await Product.findOne({ _id: id });
      const product = await Product.findById(id);
      if (!product) {
        throw createError(404, "Product does not exist");
      }
      res.send(product);
    } catch (error) {
      if (error instanceof mongoose.CastError) {
        next(createError(400, "Invalid Product Id"));
        return;
      }
      next(error);
    }
  },
  createProduct: async (req, res, next) => {
    try {
      const authorization = req.headers.authorization;
      const user = jwt.verify(authorization, process.env.JWT_SECRET);
      // console.log(user);
      //const _id = user.id;
      //const product = new Product(req.body);
      let filesArray = [];
      req.files.forEach((element) => {
        var data = fs.readFileSync(element.path);
        var insert_data = {};
        insert_data.file_data = Binary(data);
        const file = {
          fileName: element.originalname,
          filePath: element.path,
          fileType: element.mimetype,
          fileSize: fileSizeFormatter(element.size, 2),
          fileData: insert_data,
        };
        filesArray.push(file);
      });
      const product = new Product({
        name: req.body.name,
        price: req.body.price,
        color: req.body.color,
        files: filesArray,
      });
      const result = await product.save();
      res.status(201).json({
        status: "Product Added",
        data: result,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }
  },
  updateProductByID: async (req, res, next) => {
    try {
      const authorization = req.headers.authorization;
      const user = jwt.verify(authorization, process.env.JWT_SECRET);
      // console.log(user);
      //const _id = user.id;

      let filesArray = [];
      req.files.forEach((element) => {
        var data = fs.readFileSync(element.path);
        var insert_data = {};
        insert_data.file_data = Binary(data);
        const file = {
          fileName: element.originalname,
          filePath: element.path,
          fileType: element.mimetype,
          fileSize: fileSizeFormatter(element.size, 2),
          fileData: insert_data,
        };
        filesArray.push(file);
      });

      const id = req.params.id;
      const updates = req.body;
      updates.files = filesArray;
      const options = { new: true };
      const result = await Product.findByIdAndUpdate(id, updates, options);
      if (!result) {
        throw createError(404, "Product does not exist");
      }
      res.send(result);
    } catch (error) {
      if (error instanceof mongoose.CastError) {
        next(createError(400, "Invalid Product Id"));
        return;
      }
      next(error);
    }
  },
  deleteProductByID: async (req, res, next) => {
    try {
      const authorization = req.headers.authorization;
      const user = jwt.verify(authorization, process.env.JWT_SECRET);
      // console.log(user);
      //const _id = user.id;
      const id = req.params.id;
      const result = await Product.findByIdAndDelete(id);
      if (!result) {
        throw createError(404, "Product does not exist");
      }
      res.send(result);
    } catch (error) {
      if (error instanceof mongoose.CastError) {
        next(createError(400, "Invalid Product Id"));
        return;
      }
      next(error);
    }
  },
  searchProduct: async (req, res, next) => {
    try {
      const authorization = req.headers.authorization;
      const user = jwt.verify(authorization, process.env.JWT_SECRET);
      // console.log(user);
      //const _id = user.id;
      var regex = new RegExp(req.params.keyword, "i");
      console.log(regex);
      const result = await Product.find({ name: regex }, {});
      if (!result || result.length === 0) {
        throw createError(404, "Product does not exist");
      }
      res.send(result);
    } catch (error) {
      if (error instanceof mongoose.CastError) {
        next(createError(400, "Invalid Product Id"));
        return;
      }
      next(error);
    }
  },
};

// Create Product Using Promise
//console.log(req.body);
// const product = new Product({
//     name: req.body.name,
//     price: req.body.price,
// });
// product
//     .save()
//     .then((result) => {
//         console.log(result);
//         res.send(result);
//     })
//     .catch((err) => {
//         console.log(err.message);
//     });
