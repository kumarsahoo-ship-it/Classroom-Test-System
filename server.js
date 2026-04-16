const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

// ✅ MongoDB connection (use env variable)
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB Connected"))
.catch(err => console.log("MongoDB error:", err));

mongoose.connection.on("error", err => {
    console.log("MongoDB error:", err);
});

mongoose.connection.once("open", () => {
    console.log("MongoDB connected successfully");
});

// ✅ User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model("User", UserSchema);

// ✅ Routes
app.get("/", (req, res) => {
  res.send("Server Running");
});

app.get("/test", (req, res) => {
  res.send("API working");
});

// ✅ Signup
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  const newUser = new User({ username, password });
  await newUser.save();

  res.send("User registered");
});

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
    res.send("Error");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

const QuestionSchema = new mongoose.Schema({
  question: String,
  options: Array,
  answer: String
});

const Question = mongoose.model("Question", QuestionSchema);

// ADD QUESTION
app.post("/add-question", async (req, res) => {
  try {
    const q = new Question(req.body);
    await q.save();
    res.send("Question saved");
  } catch (err) {
    res.send("Error saving question");
  }
});

// GET QUESTIONS
app.get("/get-questions", async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});
