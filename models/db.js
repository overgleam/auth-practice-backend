const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Alforque DB is now connected");
  })
  .catch((err) => {
    console.log(err.message);
  });
