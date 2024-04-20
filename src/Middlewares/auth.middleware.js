import jwt from "jsonwebtoken";
import { ApiError } from "../Utils/Api_Error.js";
import { User } from "../Models/User.model.js";

// verifying the user through access token
export const VerifyJWT = async (req, _ , next) => {


  try {

    // asking for token from cokkies , if available 
    const token = req.cookies?.accessToken;

    // if token now avaliable , unauthorized user 
    if (!token) {
      throw new ApiError(401, "user is not authorized");
    }

    // checking the token authenticity
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -Refresh_Token"
    );

    // if user is not authentic 
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    console.log("auth middleware done");
    next();

  } catch (error) {

    throw new ApiError(401, error?.message || "Invalid access token")
  }
};
