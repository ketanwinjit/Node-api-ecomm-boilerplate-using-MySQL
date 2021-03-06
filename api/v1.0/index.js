const express = require("express");
const router = express.Router();
const user = require("./modules/user/routes");
const category = require("./modules/categories/routes");
const product = require("./modules/products/routes");

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hello From Node API",
  });
});

/**
 * Middleware for user routes
 */

router.use("/user", user);
router.use("/category", category);
router.use("/product", product);

module.exports = router;
