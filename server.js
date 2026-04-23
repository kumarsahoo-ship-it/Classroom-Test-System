const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("DB Connected"))
.catch(err=>console.log(err));

// SCHEMA
const QuestionSchema = new mongoose.Schema({
  testName: String,
  question: String,
  options: [String],
  answer: String,
  time: Number
});

const Question = mongoose.model("Question", QuestionSchema);

// CREATE TEST
app.post("/add-questions", async (req, res) => {

  const { testName } = req.body;

  const exists = await Question.findOne({ testName });

  if (exists) {
    return res.status(400).json({
      message: "Test name already exists"
    });
  }

  const data = req.body.questions.map(q => ({
    ...q,
    testName: req.body.testName,
    time: req.body.time
  }));

  await Question.insertMany(data);

  res.json({ message: "Saved" });
});

app.listen(10000);
