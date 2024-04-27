const express = require("express");

const router = express.Router();

const {
  createUser,
  userSignIn,
  uploadPicture,
  userSignOut,
} = require("../controllers/user");
const {
  validateUserSignUp,
  validateUserSignIn,
  userValidation,
} = require("../middleware/validation/user");
const { isAuth } = require("../middleware/auth");

const multer = require("multer");

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Invalid Image file!", false);
  }
};

const uploads = multer({ storage: storage, fileFilter: fileFilter });

router.post("/createUser", validateUserSignUp, userValidation, createUser);
router.post("/userSignIn", validateUserSignIn, userValidation, userSignIn);
router.post("/userSignOut", isAuth, userSignOut);
router.post("/uploadPicture", isAuth, uploads.single("profile"), uploadPicture);

module.exports = router;
