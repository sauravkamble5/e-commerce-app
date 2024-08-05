import createHttpError from "http-errors";
import JWT from "jsonwebtoken";
import UserModel from "../user/userModel.js";

export const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw next(createHttpError(401, "Unauthorized User"));
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = await UserModel.findById(decoded._id);
    console.log('Auth')
    next();
  } catch (error) {
    console.error(error);
    return next(createHttpError(401, "Please Authenticate"));
  }
};
