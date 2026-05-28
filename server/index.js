import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";


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



app.listen(5000, () => {
  console.log("Server running on port 5000");
});