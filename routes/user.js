const express = require("express");

const router = express.Router();

const { createUser, userSignIn } = require("../controllers/user");
const {
  validateUserSignUp,
  validateUserSignIn,
  userValidation,
} = require("../middleware/validation/user");
const { isAuth } = require("../middleware/auth");

const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user");

const storage = multer.memoryStorage();

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
router.post(
  "/uploadPicture",
  isAuth,
  uploads.single("profile"),
  async (req, res) => {
    const { user } = req;
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    try {
      const profileBuffer = req.file.buffer;
      const { width, height } = await sharp(profileBuffer).metadata();
      const avatar = await sharp(profileBuffer)
        .resize(Math.round(width * 0.5), Math.round(height * 0.5))
        .toBuffer();

      await User.findByIdAndUpdate(user._id, { avatar });

      return res.json({ success: true, message: "Profile picture uploaded" });
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: "Error in uploading picture" });
    }

    res.json({ success: true, message: "User is signed in", user });
  }
);

module.exports = router;
