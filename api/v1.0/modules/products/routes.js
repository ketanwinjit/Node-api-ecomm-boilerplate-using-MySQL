const express = require("express");
const { verifyToken, isAdmin } = require("../../../../middlewares/auth");
const router = express.Router();
const { getAllProducts, createProduct } = require("./controllers");

router.get("/getAllProducts", getAllProducts);
router.post("/createProduct", verifyToken, isAdmin, createProduct);

module.exports = router;
