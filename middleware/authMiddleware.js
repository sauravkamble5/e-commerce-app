import JWT from "jsonwebtoken";
import UserModel from "../user/userModel.js";
import createError from "http-errors";

export const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw next(createHttpError(401, "Unauthorized: No token provided"));
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    req.user = await UserModel.findById(decoded._id);

    if (!req.user) {
      return next(createError(401, "Unauthorized: User not found"));
    }

    next();
  } catch (error) {
    console.error("Error in isAuth middleware:", error.stack || error.message);
    return next(createError(401, "Please Authenticate"));
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(createError(403, "Access denied. Admins only"));
    }
    next();
  } catch (error) {
    console.error("Error in isAdmin middleware ", error.stack || error.message);
    console.error(500, "Internal server error");
  }
};
