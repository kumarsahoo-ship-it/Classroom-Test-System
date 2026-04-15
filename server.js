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
