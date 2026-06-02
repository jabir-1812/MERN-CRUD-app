import express from 'express';
import "dotenv/config";
import mongoose from 'mongoose';
import cors from "cors";
import cookieParser from "cookie-parser";


import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';


const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res)=>{
    res.send("server is running....")
})

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);



app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});