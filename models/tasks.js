const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  timestamp: Date,
  status: String,
  originalname: String,
  inputPath: String,
  outputOriginalPath: String,
  output800Path: String,
  output1024Path: String,
});

module.exports = mongoose.model("Task", schema);
