const express = require("express");
const auth = require("../../../../middlewares/auth");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgetPasswordMobile,
  resetPasswordMobile,
  getDashboard,
} = require("./controller");

router.get("/hello", (req, res) => {
  res.status(200).send("Hello from user");
});

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/forgetPassword", forgetPasswordMobile);
router.post("/resetPassword", resetPasswordMobile);
router.post("/dashboard", auth.verifyToken, getDashboard);

module.exports = router;
