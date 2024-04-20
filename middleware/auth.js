const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.userId);

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized access" });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized access" });
      }
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Session has expired try sign in again!",
        });
      }

      return res.status(400).json({ success: false, message: error.message });
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access" });
  }
};
