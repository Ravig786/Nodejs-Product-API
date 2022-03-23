const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product_controller");
const { upload } = require("../helpers/filehelper");

router.get("/", ProductController.getAllProducts);

router.post("/", upload.array("files"), ProductController.createProduct);

router.get("/:id", ProductController.findProductByID);

router.patch(
    "/:id",
    upload.array("files"),
    ProductController.updateProductByID
);

router.delete("/:id", ProductController.deleteProductByID);

router.get("/search/:keyword", ProductController.searchProduct);

module.exports = router;