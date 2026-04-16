const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect("YOUR_MONGO_URL")
.then(() => console.log("DB Connected"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Server Running");
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});

app.get("/test", (req, res) => {
  res.send("API working");
});


let users = [];

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.get("/test", (req, res) => {
  res.send("API working");
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  const newUser = new User({ username, password });
  await newUser.save();

  res.send("User registered");
});
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });

  if (user) {
    res.send("Login successful");
  } else {
    res.send("Invalid credentials");
  }
});

app.listen(3000, () => {
  console.log("Server started");
});

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB Connected"))
.catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model("User", UserSchema);
