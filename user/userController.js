import createHttpError from "http-errors";
import UserModel from "./userModel.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, city, address, country } = req.body;
    if (!name || !email || !password || !city || !address || !country) {
      const error = createHttpError(400, "All fields are required");
      return next(error);
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      const error = createHttpError(400, "User already exists ");
      return next(error);
    }
    const user = await UserModel.create({
      name,
      email,
      password,
      city,
      address,
      country,
    });
    res.status(201).send({
      success: true,
      message: "Registration Successful",
      user,
    });
  } catch (error) {
    console.error("Error in registering user", error);
    return next(createHttpError(500, "Error in registering user"));
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = createHttpError(400, "Email or Password are required");
    return next(error);
  }
  let user;

  try {
    user = await UserModel.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
  } catch (error) {
    return next(createHttpError(500, 'Error while getting user'))
  }

  //Comapre password
  try{
    const isMatch = await UserModel.comparePassword(password, user.password)
    if(!isMatch){
      return next(createHttpError(401, 'invalid credentials'))
    }
  }catch(error){
    return next(500, 'Error while comparing password')
  }
  
};
