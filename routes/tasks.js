/*
This module is in charge of:

  POST /task @form-data: file =>{
    if mimetype is image then   
    after multer saves the uploadFile in inputFolder we create a new task 
      newTask => create a task register in DB + update 
      inputPath = multer input fileName
      timestamp = Date.now()
      status = 'pending'

      return taskId
  }

*/
const express = require("express");
const router = express.Router();
const multer = require("multer");
const crypto = require("crypto");
const sharp = require("sharp");
const fs = require("fs");
const TaskService = require("../services/tasks.service");

const taskService = new TaskService();
const rootDir = process.cwd();
const outputDir = `${rootDir}/output`;
const inputDir = `${rootDir}/input`;
const inputFileName = "file-";
let ext = "";

//Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, inputDir);
  },
  filename: (req, file, cb) => {
    const timestamp = `${Date.now()}`;
    if (file.mimetype === "image/jpeg") {
      ext = ".jpg";
    }
    if (file.mimetype === "image/webp") {
      ext = ".webp";
    }
    cb(null, inputFileName + timestamp + ext);
  },
});
const upload = multer({ storage: storage });

// ROUTES
router.get("/task/:id/:size", async (req, res) => {
  const taskId = req.params.id;
  const size = req.params.size;

  const taskFromDB = await taskService.getTask(taskId);

  switch (size) {
    case "800":
      res.status(200).sendFile(taskFromDB.output800Path);
      break;
    case "1024":
      res.status(200).sendFile(taskFromDB.output1024Path);
      break;
    case "original":
      res.status(200).sendFile(taskFromDB.outputOriginalPath);
    default:
      res.status(400).send("Bad Request");
  }
});

/* GET task/:id return the processing state for an image */
router.get("/task/:id", async (req, res) => {
  const taskId = req.params.id;
  const taskFromDB = await taskService.getTask(taskId);

  res.status(200).send({
    taskId: taskFromDB._id,
    timestamp: taskFromDB.timestamp,
    status: taskFromDB.status,
    originalName: taskFromDB.originalname,
  });
});

/*POST task creates a request to process an image*/
router.post("/task", upload.single("file"), async (req, res, next) => {
  console.log("file", req.file);
  if (!req.file) {
    res.status(400).send({ message: "An image is required" });
  }

  //Updating DB
  const taskCreated = await taskService.createTask();
  taskCreated.originalname = req.file.originalname;
  taskCreated.inputPath = req.file.path;
  await taskCreated.save();

  res.status(200).send({
    taskId: taskCreated._id,
    timestamp: taskCreated.timestamp,
    status: taskCreated.status,
    originalName: taskCreated.originalname,
  });
});

module.exports = router;
