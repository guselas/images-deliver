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
