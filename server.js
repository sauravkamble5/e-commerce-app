import express from "express";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbConnect.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import Stripe from "stripe";

dotenv.config();

connectDB();

export const stripe = new Stripe(process.env.STRIPE_API_SECRET);

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const PORT = process.env.PORT || 8000;
const app = express();

// Middleware
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(morgan("dev"));
app.use(express.json());

app.use(cors());
app.use(cookieParser());

// import Routes
import userRouter from "./user/userRoute.js";
import productRouter from "./product/productRoute.js";
import categoryRouter from "./category/categoryRoute.js";
import orderRouter from "./order/orderRouter.js";

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/order", orderRouter);

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
