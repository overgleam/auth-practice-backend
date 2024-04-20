const User = require("../models/user");
const jwt = require("jsonwebtoken");

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

  res.json(user);
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

  res.json({ success: true, message: "User is signed in", user, token });
};
