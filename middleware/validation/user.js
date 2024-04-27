const { check, validationResult } = require("express-validator");

exports.validateUserSignUp = [
  check("name")
    .trim()
    .not()
    .isEmpty()
    .isString()
    .withMessage("Name is invalid")
    .isLength({ min: 3, max: 32 })
    .withMessage("Name must be between 3 to 32 characters"),
  check("email").normalizeEmail().isEmail().withMessage("Email is Invalid"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 4 })
    .withMessage("Password must be 4 characters long"),
  check("confirmPassword")
    .trim()
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      if (value != req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

exports.validateUserSignIn = [
  check("email").normalizeEmail().isEmail().withMessage("Email is required"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 4 })
    .withMessage("Password must be 4 characters long"),
];

exports.userValidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (result.length) {
    return res.json({ success: false, message: result[0].msg });
  }
  next();
};
