import UserModel from "./userModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";
import createError from "http-errors";

export const register = async (req, res, next) => {
  try {
    const { name, email, password, city, address, country, phone, answer } =
      req.body;
    if (
      !name ||
      !email ||
      !password ||
      !city ||
      !address ||
      !country ||
      !phone ||
      !answer
    ) {
      return next(createError(400, "All fields are required"));
    }
    //Check for if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return next(createError(400, "User already exists "));
    }

    //Create new user
    const user = await UserModel.create({
      name,
      email,
      password,
      city,
      address,
      country,
      phone,
      answer,
    });

    res.status(201).send({
      success: true,
      message: "Registration Successful",
      user,
    });
  } catch (error) {
    console.error("Error in registering user:", error);
    next(createError(500, "Internal server error"));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError(400, "Email or Password are required"));
    }

    //Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return next(createError(404, "User not found"));
    }

    //Comapre password
    const isMatch = await user.comparePassword(password, user.password);
    if (!isMatch) {
      return next(createError(401, "Invalid credentials"));
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
    console.error("Error in logging user:", error);
    next(createError(500, "Internal server error"));
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return next(createError(404, "User not found")); // Added check for user existence
    }

    res.status(200).send({
      success: true,
      message: "User Profile Fetch Successuly",
      user,
    });
  } catch (error) {
    console.error("Error in getting user profile :", error);
    next(createError(500, "Internal server error"));
  }
};

export const logoutUser = (req, res, next) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        secure: process.env.NODE_ENV === "development" ? true : false,
        maxAge: 3600000, //Cookies expires in 1hour
      })
      .send({
        status: true,
        message: "Logout Successfuly",
      });
  } catch (error) {
    console.error("Error in logging out user:", error);
    next(createError(500, "Internal server error"));
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return next(createError(404, "User not found"));
    }
    const { name, email, address, city, country, phone } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (city) user.city = city;
    if (country) user.country = country;
    if (phone) user.phone = phone;

    await user.save();
    res.status(200).send({
      success: true,
      message: "User Updated",
      user,
    });
  } catch (error) {
    console.error("Error in updating user :", error);
    next(createError(500, "Internal server error"));
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return next(createError(400, "Old and New Password are required"));
    }

    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const isMatch = await user.comparePassword(oldPassword, user.password);
    if (!isMatch) {
      return next(createError(401, "Invalid old password"));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Password Updated",
      user,
    });
  } catch (error) {
    console.error("Error in updating password :", error);
    next(createError(500, "Internal server error"));
  }
};

export const updatePicture = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    //file get from client photo
    const file = getDataUri(req.file);

    //delete previous image
    await cloudinary.v2.uploader.destroy(user.profilePic.public_id);

    // Update with new image
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    user.profilePic = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    await user.save();
    res.status(200).send({
      status: true,
      message: "Profile pic updated successfuly",
      user,
    });
  } catch (error) {
    console.error("Error in updating picture :", error);
    next(createError(500, "Internal server error"));
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword, answer } = req.body;
    if (!email || !newPassword || !answer) {
      return next(createError(400, "Please fill all fields"));
    }

    const user = await UserModel.findOne({ email, answer });
    if (!user) {
      return next(createError(404, "Invalid user or answer"));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).send({
      status: true,
      message: "Password reset successfuly",
    });
  } catch (error) {
    console.error("Error in resetting password :", error);
    next(createError(500, "Internal server error"));
  }
};
