const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cors());

// ================= MONGODB CONNECT =================
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.log(err));


// ================= USER SCHEMA =================
const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model("User", UserSchema);


// ================= QUESTION SCHEMA =================
const QuestionSchema = new mongoose.Schema({
  testName: String,
  question: String,
  options: Array,
  answer: String,
  time: Number
});
const Question = mongoose.model("Question", QuestionSchema);


// ================= RESULT SCHEMA =================
const ResultSchema = new mongoose.Schema({
  username: String,
  testName: String,
  score: Number,
  total: Number
});
const Result = mongoose.model("Result", ResultSchema);


// ================= ROUTES =================

// HOME
app.get("/", (req, res) => {
  res.send("Server Running");
});


// ================= AUTH =================

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = new User({ username, password });
    await user.save();

    res.send("User registered");
  } catch (err) {
    console.log(err);
    res.status(500).send("Signup error");
  }
});


// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });

    if (user) {
      res.send("Login successful");
    } else {
      res.send("Invalid credentials");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Login error");
  }
});


// ================= CREATE TEST =================
app.post("/add-questions", async (req, res) => {
  try {
    const { testName, questions, time } = req.body;

    // ❌ 1. Block duplicate test name
    const exists = await Question.findOne({ testName });
    if (exists) {
      return res.status(400).json({
        message: "Test name already exists. Use another name."
      });
    }

    // ❌ 2. Prevent empty / partial data
    if (!questions || questions.length === 0) {
      return res.status(400).json({
        message: "No questions provided"
      });
    }

    // ❌ 3. Check all questions are complete
    for (let q of questions) {
      if (
        !q.question ||
        !q.options ||
        q.options.includes("") ||
        !q.answer
      ) {
        return res.status(400).json({
          message: "Incomplete question detected"
        });
      }
    }

    // ✅ 4. Save full test (single insert)
    const data = questions.map(q => ({
      testName,
      question: q.question,
      options: q.options,
      answer: q.answer,
      time
    }));

    await Question.insertMany(data);

    res.json({ message: "Test created successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});


// ================= GET TESTS =================
app.get("/tests", async (req, res) => {
  try {
    const tests = await Question.distinct("testName");
    res.json(tests);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching tests");
  }
});


// ================= GET QUESTIONS =================
app.get("/questions/:testName", async (req, res) => {
  try {
    const data = await Question.find({
      testName: req.params.testName
    });

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching questions");
  }
});


// ================= SAVE RESULT =================
app.post("/result", async (req, res) => {
  try {
    const { username, testName, score, total } = req.body;

    const newResult = new Result({
      username,
      testName,
      score,
      total
    });

    await newResult.save();

    res.send("Result saved");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving result");
  }
});


// ================= GET USER RESULTS =================
app.get("/results/:username", async (req, res) => {
  try {
    const data = await Result.find({
      username: req.params.username
    });

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching results");
  }
});


// ================= LEADERBOARD =================
app.get("/leaderboard/:testName", async (req, res) => {
  try {
    const data = await Result.find({
      testName: req.params.testName
    }).sort({ score: -1 });

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Leaderboard error");
  }
});


// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
