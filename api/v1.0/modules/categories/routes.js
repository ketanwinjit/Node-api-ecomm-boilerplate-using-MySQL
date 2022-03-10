const express = require("express");
const { verifyToken, isAdmin } = require("../../../../middlewares/auth");
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  deleteCategory,
  editCategory,
} = require("./controller");

router.get("/getAllCategories", getAllCategories);
router.post("/createCategory", verifyToken, isAdmin, createCategory);
router.post("/deleteCategory", verifyToken, isAdmin, deleteCategory);
router.post("/edit/:id", editCategory);

module.exports = router;
