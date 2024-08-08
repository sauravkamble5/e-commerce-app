import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbConnect.js";
import router from "./user/userRoute.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";

dotenv.config();

connectDB();
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
 api_secret: process.env.CLOUDINARY_SECRET,
});

const PORT = process.env.PORT || 8000;
const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());

app.use(cors());
app.use(cookieParser());

// Routes
app.use("/api/v1/user", router);

// Error handling middleware
app.use(errorHandler);

// Home route
app.get("/", (req, res) => {
  return res.status(200).send("<h2>Welcome to E-Commerce App</h2>");
});

// Start server
app.listen(PORT, () => {
  console.log(
    `E-Commerce app listening on ${PORT} on ${process.env.NODE_ENV} Mode`
  );
});
