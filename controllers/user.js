const User = require("../models/user");
const jwt = require("jsonwebtoken");
// const sharp = require("sharp");
const cloudinary = require("../helper/imageUpload");

exports.createUser = async (req, res) => {
  const data = req.body;
  const isNewUser = await User.isThisEmailInUse(data.email);
  if (isNewUser) {
    return res.json({ success: false, message: "Email is already in use" });
  }
  const user = await User({
    name: data.name,
    email: data.email,
    password: data.password,
  });
  await user.save();

  res.json({ success: true, message: "User is created", user: user });
};

exports.userSignIn = async (req, res) => {
  const data = req.body;
  const user = await User.findOne({ email: data.email });
  if (!user) {
    return res.json({ success: false, message: "Email not found" });
  }
  const result = await user.comparePassword(data.password);
  if (!result) {
    return res.json({ success: false, message: "Password is incorrect" });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  let oldTokens = user.tokens || [];

  if (oldTokens.length) {
    oldTokens = oldTokens.filter((token) => {
      const timeDiff = (Date.now() - parseInt(token.signedAt)) / 1000;
      if (timeDiff < 86400) {
        return token;
      }
    });
  }

  await User.findByIdAndUpdate(user._id, {
    tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
  });

  const userInfo = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };

  res.json({
    success: true,
    message: "User is signed in",
    user: userInfo,
    token,
  });
};

exports.userSignOut = async (req, res) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.json({ success: false, message: "Token not found" });
    }

    const tokens = req.user.tokens || [];

    const newTokens = tokens.filter((t) => t.token !== token);

    await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });

    return res.json({ success: true, message: "User is signed out" });
  }
};

exports.uploadPicture = async (req, res) => {
  const { user } = req;
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  try {
    // const profileBuffer = req.file.buffer;
    // const { width, height } = await sharp(profileBuffer).metadata();
    // const avatar = await sharp(profileBuffer)
    //   .resize(Math.round(width * 0.5), Math.round(height * 0.5))
    //   .toBuffer();

    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${user.id}_profile`,
      width: 150,
      height: 150,
      crop: "fill",
    });

    await User.findByIdAndUpdate(user._id, { avatar: result.url });

    const userInfo = {
      name: user.name,
      email: user.email,
      avatar: result.url,
    };

    return res.json({
      success: true,
      message: "Profile picture uploaded",
      user: userInfo,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Error in uploading picture" });
  }
};
