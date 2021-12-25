const express = require("express");
const { verifyToken, isAdmin } = require("../../../../middlewares/auth");
const router = express.Router();
const { createCategory } = require("./controller");

router.post("/createCategory", verifyToken, isAdmin, createCategory);

module.exports = router;
