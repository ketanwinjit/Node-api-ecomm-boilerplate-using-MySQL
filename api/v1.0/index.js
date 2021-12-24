const express = require("express");
const router = express.Router();
const user = require("./modules/user/routes");

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

module.exports = router;
