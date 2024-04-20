const express = require("express");

const router = express.Router();

const { createUser, userSignIn } = require("../controllers/user");
const {
  validateUserSignUp,
  userValidation,
  validateUserSignIn,
} = require("../middleware/validation/user");
const { isAuth } = require("../middleware/auth");

router.post("/createUser", validateUserSignUp, userValidation, createUser);
router.post("/userSignIn", validateUserSignIn, userValidation, userSignIn);
router.post("/createPost", isAuth, (req, res) => {
  res.send("Welcome you're in secret route!");
});

module.exports = router;
