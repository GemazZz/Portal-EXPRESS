const express = require("express");
const cors = require("cors");
const app = express();
const { readFile, writeFile } = require("fs").promises;

const corsOpt = {
  origin: "http://192.168.101.44:3001",
};
app.use(cors(corsOpt));

const filePath = "C:/Users/User/Desktop/NODE Express Portal/userData.json";

//Workers Editor
app.get("/v1/workersEditor", async (req, res) => {
  try {
    const userData = JSON.parse(await readFile(filePath, "utf8"));
    res.json(userData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error processing request");
  }
});

app.post("/v1/workersEditor/:userId/:name/:surname", async (req, res) => {
  const userId = parseInt(req.params.userId);
  const name = req.params.name;
  const surname = req.params.surname;
  const newWorker = { userId, surname, name };

  try {
    const userData = JSON.parse(await readFile(filePath, "utf8"));
    if (userData.some((data) => data.userId === userId)) {
      res.status(400).send("Already Added!");
    } else {
      const callbackData = [newWorker, ...userData];
      await writeFile(filePath, JSON.stringify(callbackData));
      res.json(callbackData);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error processing request");
  }
});

app.delete("/v1/workersEditor/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const userData = JSON.parse(await readFile(filePath, "utf8"));
    const callbackData = userData.filter((user) => user.userId !== userId);
    await writeFile(filePath, JSON.stringify(callbackData));
    res.json(callbackData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error processing request");
  }
});

app.listen(3000, () => {
  console.log("Done!");
});
