import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbConnect.js";
import router from "./user/userRoute.js";
import colors from "colors";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", router);

app.use(errorHandler);

app.get("/", (req, res) => {
  return res.status(200).send("<h2>Welcome to E-Commerce App</h2>");
});

app.listen(PORT, () => {
  console.log(`E-Commerce app listening on ${PORT}`.bgCyan.bgMagenta);
});
