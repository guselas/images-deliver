const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const imagesRouter = require("./routes/tasks");
const ImageService = require("./services/image.service");

const imageService = new ImageService();
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//To allow cross-origin requests
app.use(cors());

// DB connection
const MONGODB_URL = "mongodb://localhost:27017/imagesDeliver";
mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

app.use("/", imagesRouter);
imageService.init();

module.exports = app;
