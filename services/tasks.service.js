const TaskModel = require("../models/tasks");

class TaskService {
  constructor() {}

  async getTask(id) {
    return await TaskModel.findById(id);
  }

  async createTask() {
    const newTask = new TaskModel();
    newTask.timestamp = Date.now();
    newTask.status = "pending";
    newTask.originalname = "";
    newTask.inputPath = "";
    newTask.outputOriginalPath = "";
    newTask.output800Path = "";
    newTask.output1024Path = "";
    await newTask.save();
    return newTask;
  }

  async getPendingTasks() {
    return await TaskModel.find({ status: "pending" });
  }
}

module.exports = TaskService;
