const express = require("express");
require("dotenv").config();
// const mongoose = require("mongoose");
require("./models/db");

// const User = require("./models/user");
const userRouter = require("./routes/user");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRouter);

// const test = async (email, password) => {
//   try {
//     console.log(User);
//     const user = await User.findOne({ email: email });
//     const result = await user.comparePassword(password);
//     console.log(user + ": and boom :" + result);
//   } catch (error) {
//     console.error(error.message);
//   }
// };

// test("charlie3@gmail.com", "1234");

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
