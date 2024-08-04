import createHttpError from "http-errors";
import JWT from "jsonwebtoken";
import UserModel from "../user/userModel.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log(token);
    if (!token) {
      throw next(createHttpError(401, "token is missing"));
    }

    const parsedToken = token.split(" ")[1];
    const decoded = JWT.verify(parsedToken, process.env.JWT_SECRET);
    req.user = await UserModel.findById(decoded._id);
    next();
  } catch (error) {
    console.error(error);
    return next(createHttpError(401, "Please Authenticate"));
  }
};

