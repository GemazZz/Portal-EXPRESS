const express = require("express");
const cors = require("cors");
const app = express();
const { readFile, writeFile } = require("fs").promises;

const corsOpt = {
  origin: "http://192.168.101.44:3000",
};
app.use(cors(corsOpt));
app.use(express.json());

const fileUserDataPath = "C:/Users/User/Desktop/NODE Express Portal/userData.json";
const fileSpecialsDataPath = "C:/Users/User/Desktop/NODE Express Portal/specialsData.json";
const fileQuestionDataPath = "C:/Users/User/Desktop/NODE Express Portal/questionData.json";

//Workers Editor
app.get("/v1/workersEditor", async (req, res) => {
  try {
    const userData = JSON.parse(await readFile(fileUserDataPath, "utf8"));
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
    const userData = JSON.parse(await readFile(fileUserDataPath, "utf8"));
    if (userData.some((data) => data.userId === userId)) {
      res.status(400).send("Already Added!");
    } else {
      const callbackData = [newWorker, ...userData];
      await writeFile(fileUserDataPath, JSON.stringify(callbackData));
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
    const userData = JSON.parse(await readFile(fileUserDataPath, "utf8"));
    const callbackData = userData.filter((user) => user.userId !== userId);
    await writeFile(fileUserDataPath, JSON.stringify(callbackData));
    res.json(callbackData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error processing request");
  }
});

//Special Editor
app.get("/v1/specialsEditor", async (req, res) => {
  try {
    const specialsData = JSON.parse(await readFile(fileSpecialsDataPath, "utf8"));
    res.json(specialsData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error processing request");
  }
});

app.post("/v1/specialsEditor/:special", async (req, res) => {
  const special = req.params.special;
  try {
    const specialsData = JSON.parse(await readFile(fileSpecialsDataPath, "utf8"));
    if (specialsData.some((existingSpecial) => existingSpecial.special === special)) {
      res.status(400).send("Already Added!");
    } else {
      const callbackData = [...specialsData, { special }];
      await writeFile(fileSpecialsDataPath, JSON.stringify(callbackData));
      res.json(callbackData);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error processing request");
  }
});

app.delete("/v1/specialsEditor/:special", async (req, res) => {
  const special = req.params.special;
  try {
    const specialsData = JSON.parse(await readFile(fileSpecialsDataPath, "utf8"));
    const callbackData = specialsData.filter((user) => user.special !== special);
    await writeFile(fileSpecialsDataPath, JSON.stringify(callbackData));
    res.json(callbackData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error processing request");
  }
});

//Question Editor
app.get("/v1/questionEditor/:special", async (req, res) => {
  const { special } = req.params;
  console.log(special);
  try {
    const questionData = JSON.parse(await readFile(fileQuestionDataPath, "utf8"));
    const filteredData = questionData.filter((question) => {
      return question.category === special;
    });
    console.log(filteredData);
    res.json(filteredData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error processing request");
  }
});

app.post("/v1/questionEditor", async (req, res) => {
  const question = req.body;
  try {
    const questionData = JSON.parse(await readFile(fileQuestionDataPath, "utf8"));
    if (questionData.some((existingQuestion) => existingQuestion.questionId === question.questionId)) {
      res.status(400).send("Already Added!");
    } else {
      const callbackData = [...questionData, question];
      await writeFile(fileQuestionDataPath, JSON.stringify(callbackData));
      res.status(200).send("Question Added!");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error processing request");
  }
});

app.listen(4000, () => {
  console.log("Done!");
});
