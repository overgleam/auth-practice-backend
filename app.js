const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
require("./models/db");

const User = require("./models/user");
const userRouter = require("./routes/user");

const app = express();

app.use(express.json());
app.use(userRouter);

// const test = async (email, password) => {
//   const user = await User.findOne({ email: email });
//   const result = await user.comparePassword(password);
//   console.log(user + ": and boom :" + result);
// };

// test("charlie3@gmail.com", "1234");

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server is running on port 1234");
});

//mongodb+srv://dbAlforque:<password>@alforquedb.ucffc44.mongodb.net/?retryWrites=true&w=majority
