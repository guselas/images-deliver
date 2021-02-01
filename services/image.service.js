// this modules is in charge of:
// has a loop for each 10 secs, ask if there are new tasks pending
// if there are tasks pending this module will process tasks
/*
Task interface{
    taskId: ObjectId,
    timestamp: Date,
    status: string // pending / in-process / done
    inputPath: string, //generted by multer on POST /task
    outputOriginalPath: string //output/originalFileName/original/md5.ext
    output800Path: string //output/originalFileName/800/md5.ext
    output1024Path: string //output/originalFileName/1024/md5.ext
}
*/
/* processImage = async (taskId)=> {
    getTaskFromDB = await ....
    getTaskFromDB.status = 'in-process';
    update getTaskFromDB;
    we move getTaskFromDB.inputPath to outputOriginalPath
    we sharp().resize(800) to output800Path,
    we sharp().resize(1024) to output1024Path,
    we sharp() to outputOriginalPath,
    we update TaskFromDB;
}


Main loop:
    every 5 secs get Pending tasks
    foreach pendingTask do processImage(pendingTaskId)
*/

const crypto = require("crypto");
const sharp = require("sharp");
const fs = require("fs");
const TaskService = require("../services/tasks.service");

const taskService = new TaskService();
const rootDir = process.cwd();
const outputDir = `${rootDir}/output`;

class ImageService {
  constructor() {}

  async init() {
    console.log("Image Service init");
    setInterval(async () => {
      await this.tick();
    }, 5000);
  }

  async tick() {
    console.log("Image service tick");
    const pendingTasks = await taskService.getPendingTasks();
    for (let task of pendingTasks) {
      await this.processImage(task);
    }
  }

  async processImage(task) {
    task.status = "in-process";
    await task.save();
    const originalName = task.originalname.split(".")[0];
    const extension = task.originalname.split(".")[1];
    const inputFilename = task.inputPath.split("/").pop();

    for (let size of [800, 1024]) {
      const dirName = `${outputDir}/${originalName}/${size}`;
      const tmpFilename = `${dirName}/${inputFilename}`;
      fs.mkdirSync(dirName, { recursive: true });

      await sharp(task.inputPath).resize(size).toFile(tmpFilename);
      const outputFilename = `${dirName}/${crypto
        .createHash("md5")
        .update(tmpFilename)
        .digest("hex")}.${extension}`;

      fs.renameSync(tmpFilename, outputFilename);
      task[`output${size}Path`] = outputFilename;
    }

    const dirName = `${outputDir}/${originalName}/original`;
    const tmpFilename = `${dirName}/${inputFilename}`;

    fs.mkdirSync(dirName, { recursive: true });
    fs.renameSync(task.inputPath, tmpFilename);

    const outputFilename = `${dirName}/${crypto
      .createHash("md5")
      .update(tmpFilename)
      .digest("hex")}.${extension}`;

    fs.renameSync(tmpFilename, outputFilename);
    task.outputOriginalPath = outputFilename;

    task.status = "done";
    await task.save();
  }
}

module.exports = ImageService;
