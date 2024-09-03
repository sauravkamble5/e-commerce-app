import JWT from "jsonwebtoken";
import UserModel from "../user/userModel.js";
import createError from "http-errors";

// Middleware to check if the user is authenticated
export const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return next(createError(401, "Unauthorized: No token provided"));
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET); // Verify the token using the secret key

    req.user = await UserModel.findById(decoded._id); // Fetch the user based on decoded token's user ID

    if (!req.user) {
      // Check if user exists
      return next(createError(401, "Unauthorized: User not found"));
    }

    next(); // Continue to the next middleware or route
  } catch (error) {
    console.error("Error in isAuth middleware:", error.stack || error.message);
    return next(createError(401, "Please Authenticate"));
  }
};

// Middleware to check if the user has admin privileges
export const isAdmin = async (req, res, next) => {
  try {
    //Explicit role check with clear error handling for non-admin users
    if (req.user.role !== "admin") {
      return next(createError(403, "Access denied. Admins only"));
    }
    next();     // Continue to the next middleware or route
  } catch (error) {
    console.error("Error in isAdmin middleware ", error.stack || error.message);
    console.error(500, "Internal server error");
  }
};
