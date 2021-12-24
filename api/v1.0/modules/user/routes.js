const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgetPasswordMobile,
  resetPassword,
} = require("./controller");

router.get("/hello", (req, res) => {
  res.status(200).send("Hello from user");
});

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/forgetPassword", forgetPasswordMobile);
router.post("/resetPassword", resetPassword);

module.exports = router;
