const mongoose = require("mongoose");

const uri =
  "mongodb+srv://younsiahmed:younsiahmed@cluster0.ptff1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
  });
};

module.exports = connectDB;
