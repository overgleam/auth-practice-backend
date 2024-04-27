const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    max: 32,
  },
  avatar: {
    type: String,
  },
  tokens: [{ type: Object }],
});

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) {
        return next(err);
      }
      this.password = hash;
      next();
    });
  }
});

userSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error("Password is required");
  try {
    const result = await bcrypt.compare(password, this.password);
    // console.log("compare result: ", result);
    return result;
  } catch (error) {
    console.log("error in ComparePassword: ", error.message);
  }
};

userSchema.statics.isThisEmailInUse = async function (email) {
  if (!email) throw new Error("Email is required");
  try {
    const user = await this.findOne({ email });
    if (user) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("error in isThisEmailInUse: ", error.message);
  }
};

module.exports = mongoose.model("users", userSchema);
