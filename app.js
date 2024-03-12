const express = require("express");
const cors = require("cors");
const { getDataFunc, ObjectCompareFunc } = require("./helpers");
const app = express();
const { readFile, writeFile } = require("fs").promises;

const corsOpt = {
  origin: ["http://192.168.101.44:3000", "http://localhost:3000"],
};
app.use(cors(corsOpt));
app.use(express.json());

const fileUserDataPath = "C:/Users/User/Desktop/NODE Express Portal/data/userData.json";
const fileSpecialsDataPath = "C:/Users/User/Desktop/NODE Express Portal/data/specialsData.json";
const fileQuestionDataPath = "C:/Users/User/Desktop/NODE Express Portal/data/questionData.json";
const fileStatsPath = "C:/Users/User/Desktop/NODE Express Portal/data/stats.json";

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
      const callbackData = [{ special }, ...specialsData];
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
  try {
    const questionData = JSON.parse(await readFile(fileQuestionDataPath, "utf8"));
    const filteredData = questionData.filter((question) => {
      return question.category === special;
    });
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

app.delete("/v1/questionEditor/:questionId", async (req, res) => {
  const questionId = req.params.questionId;
  const questionData = JSON.parse(await readFile(fileQuestionDataPath, "utf8"));
  const filteredData = questionData.filter((question) => {
    return question.questionId !== parseInt(questionId);
  });
  await writeFile(fileQuestionDataPath, JSON.stringify(filteredData));
  res.json({ message: "Done!" });
});

//usersAnswers
app.get("/v1/stats", async (req, res) => {
  try {
    const stats = JSON.parse(await readFile(fileStatsPath, "utf8"));
    res.json(stats);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error processing request");
  }
});

app.post("/v1/stats/:time", async (req, res) => {
  const userAnswers = req.body;
  const time = req.params.time;
  userAnswers.time = time;
  const date = getDataFunc();
  userAnswers.date = date;
  userAnswers.statsId = new Date().getTime();
  const questionData = JSON.parse(await readFile(fileQuestionDataPath, "utf8"));
  const filteredData = questionData.filter((question) => {
    return question.category === userAnswers.special;
  });
  const obj = {};
  filteredData.forEach((question) => {
    if (!question.multipleAnswer) {
      obj[question.questionId] = question.correctAnswer;
    } else {
      const answers = [];
      if (question.checkFirstAnswer) answers.push(question.firstAnswer);
      if (question.checkSecondAnswer) answers.push(question.secondAnswer);
      if (question.checkThirdAnswer) answers.push(question.thirdAnswer);
      if (question.checkFourthAnswer) answers.push(question.fourthAnswer);
      obj[question.questionId] = answers;
    }
  });
  const total = Object.keys(obj).length;
  const score = ObjectCompareFunc(userAnswers, obj);
  const percent = Math.ceil((score / total) * 100);
  const result = `${score}/${total}  ||  ${percent}%`;
  userAnswers.result = result;
  const stats = JSON.parse(await readFile(fileStatsPath, "utf8"));
  const callbackData = [userAnswers, ...stats];
  await writeFile(fileStatsPath, JSON.stringify(callbackData));
  res.json({ message: "Done!" });
});

app.delete("/v1/stats/:statsId", async (req, res) => {
  const statsId = req.params.statsId;
  const stats = JSON.parse(await readFile(fileStatsPath, "utf8"));
  const filteredData = stats.filter((stat) => {
    return stat.statsId !== parseInt(statsId);
  });
  await writeFile(fileStatsPath, JSON.stringify(filteredData));
  res.json(filteredData);
});

const HOST_IP = "192.168.101.44";

app.listen(4000, HOST_IP, () => {
  console.log("Done!");
});
