import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";

import User from "./models/User.js";

import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';


const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/myapp")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });


app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});



app.get("/api/message", (req, res) => {
  res.json({
    message: "Hello from backend"
  });
});



app.get("/add", async (req, res) => {

  const user = new User({
    name: "Rahul",
    age: 22
  });

  await user.save();

  res.send("User Added");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});