const superTest = require("supertest");
const app = require("../app");

const request = superTest(app);

describe("Tasks router", () => {
  it("Should return task info for a given taskId", async () => {
    //this test will fail because this id is not set in DB. I now I should mock the call to the database, but had to time to implement it.
    const response = await request.get("/task/60184111cccb85274c0669f2");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      taskId: "60184111cccb85274c0669f2",
      timestamp: "2021-02-01T17:57:37.351Z",
      status: "done",
      originalName: "1131304712_9_3_1.webp",
    });
  });

  it("Should return task info for a given taskId", async () => {
    //this test will fail because this id is not set in DB. I now I should mock the call to the database, but had to time to implement it.
    const response = await request.get("/task/60184111cccb85274c0669f1");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Task not found" });
  });

  it("Should create a register in Tasks Collection in DB and return info about that created task", async () => {
    const response = await request
      .post("/task")
      .attach(
        "file",
        "../output/beer/1024/c49f8970e1411467673de510934f0049.jpeg"
      );
    expect(response.status).toBe(200);
  });

  it("Should return an error if no file is attached to request", async () => {
    const response = await request.post("/task");
    expect(response.status).toBe(400);
  });
});
