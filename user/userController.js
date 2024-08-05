import createHttpError from "http-errors";
import UserModel from "./userModel.js";
import createError from "http-errors";

export const register = async (req, res, next) => {
  try {
    const { name, email, password, city, address, country, phone } = req.body;
    if (
      !name ||
      !email ||
      !password ||
      !city ||
      !address ||
      !country ||
      !phone
    ) {
      throw createHttpError(400, "All fields are required");
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw createHttpError(400, "User already exists ");
    }
    const user = await UserModel.create({
      name,
      email,
      password,
      city,
      address,
      country,
      phone,
    });
    res.status(201).send({
      success: true,
      message: "Registration Successful",
      user,
    });
  } catch (error) {
    console.error("Error in registering user", error);
    next(error);
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw createHttpError(400, "Email or Password are required");
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    //Comapre password
    const isMatch = await user.comparePassword(password, user.password);
    if (!isMatch) {
      throw createHttpError(401, "Invalid credentials");
    }

    // Generate token
    const token = await user.generateToken();
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        secure: process.env.NODE_ENV === "development" ? true : false,
        maxAge: 3600000,
      })
      .send({
        success: true,
        message: "Login Successful",
        token,
        user,
      });
  } catch (error) {
    console.error("Error in logging user", error);
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);

    res.status(200).send({
      success: true,
      message: "User Profile Fetch Successuly",
      user,
    });
  } catch (error) {
    console.error("Error in getting user profile", error);
    next(error);
  }
};

export const logoutUser = (req, res, next) => {
  try {
    res.status(200).cookie("token", "", {
      httpOnly: process.env.NODE_ENV === "development" ? true : false,
      secure: process.env.NODE_ENV === "development" ? true : false,
      maxAge: 3600000,
    })
    .send({
      status:true,
      message:"Logout Successfuly"
    })
  } catch (error) {
    next(error);
  }
};
